import IPFS from 'ipfs'
import OrbitDB from 'orbit-db'
import Config from '../config'
import IPFSAccessController from 'orbit-db-access-controllers/src/ipfs-access-controller'
import EthIdentityProvider from 'orbit-db-identity-provider/src/ethereum-identity-provider'
import { ethers } from 'ethers'

// OrbitDB instance
let orbitdb

// Databases
let programs

// Start IPFS
export const initIPFS = async () => {
  return await IPFS.create(Config.ipfs)
}

class EthAccessController extends IPFSAccessController {
  static get type() { return 'ethereum' }
}

// Start OrbitDB
export const initOrbitDB = async (ipfs) => {
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const wallet = provider.getSigner()
  console.log(wallet)

  OrbitDB.Identities.addIdentityProvider(EthIdentityProvider)
  OrbitDB.AccessControllers.addAccessController({ AccessController: EthAccessController })

  const keystore = new OrbitDB.Keystore('./eth/keys')

  const type = EthIdentityProvider.type

  const identity = await OrbitDB.Identities.createIdentity({
    type, keystore, wallet
  })

  orbitdb = await OrbitDB.createInstance(ipfs, { identity })
  return orbitdb
}

export const getAllDatabases = async () => {
  if (!programs && orbitdb) {
    // Load programs database
    programs = await orbitdb.feed('network.programs', {
      accessController: { write: [orbitdb.identity.id] },
      create: true
    })
    await programs.load()
  }

  return programs
    ? programs.iterator({ limit: -1 }).collect()
    : []
}

export const getDB = async (address) => {
  let db
  if (orbitdb) {
    db = await orbitdb.open(address)
    await db.load()
  }
  return db
}

export const addDatabase = async (address) => {
  const db = await orbitdb.open(address)
  return programs.add({
    name: db.dbname,
    type: db.type,
    address: address,
    added: Date.now()
  })
}

export const createDatabase = async (name, type, permissions, iam) => {
  let accessController

  switch (permissions) {
    case 'public':
      accessController = {
        type: iam,
        write: ['*']
      }
      break
    default:
      accessController = {
        type: iam,
        write: [orbitdb.identity.id]
      }
      break
  }

  const db = await orbitdb.create(name, type, { accessController })

  return programs.add({
    name,
    type,
    address: db.address.toString(),
    added: Date.now()
  })
}

export const removeDatabase = async (hash) => {
  return programs.remove(hash)
}
