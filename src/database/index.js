import IPFS from 'ipfs'
import OrbitDB from 'orbit-db'
import config from '../config'

const get = async url => {
  const response = await fetch(url)
  const json = await response.json()
  return json
}

let ipfs
let orbitdb
// Databases
let programs

// Setup all databases
export const initIPFS = async () => {
  // Start IPFS
  return await IPFS.create({ config: { Bootstrap: [] } })
}

export const initOrbitDB = async (ipfs) => {
  // Start OrbitDB
  orbitdb = await OrbitDB.createInstance(ipfs)
  // Load programs database
  programs = await orbitdb.feed('network.programs', {
    accessController: { write: [orbitdb.identity.id] },
    create: true
  })
  await programs.load()
  // TODO: rest
  return {
    programs
  }
}

export const getAllPrograms = () => {
  return programs
    ? programs.iterator({ limit: -1 }).collect()
    : []
}

export const getDB = async (address) => {
  const db = await orbitdb.open(address)
  await db.load()
  return db
}

export const addProgram = async (name, type) => {
  return programs.add({ 
    name, 
    type, 
    address: '/orbitdb/zdpuAzCwF8JYYGAL7U7TtUkCSQK3mSRsM3tVtMQQJnjBmrjpf',
    added: Date.now()
  })
}

export const createProgram = async (name, type) => {
  const db = await orbitdb.create(name, type)
  return programs.add({ 
    name,
    type,
    address: db.address.toString(),
    added: Date.now()
  })
}

export const removeProgram = async (hash) => {
  return programs.remove(hash)
}

export const getProgram = id => get(`${config.primeNodeUrl}/programs/${id}`)
export const getPopularPrograms = () => get(`${config.primeNodeUrl}/programs/?popular`)
export const getCategories = () => get(`${config.primeNodeUrl}/programs/categories`)
export const getStats = () => get(`${config.primeNodeUrl}/programs/stats`)
