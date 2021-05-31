import React from 'react'
import {
  majorScale,
  minorScale,
  Pane,
  Text,
  StatusIndicator
} from 'evergreen-ui'

import { initIPFS, initOrbitDB, getAllDatabases } from '../database'
import { actions, useStateValue } from '../state'

import ConnectToWalletButton from './ConnectToWalletButton'

function Systems () {
  const [appState, dispatch] = useStateValue()

  React.useEffect(() => {
    dispatch({ type: actions.PROGRAMS.SET_PROGRAMS_LOADING, loading: true })

    initIPFS().then(async (ipfs) => {
      dispatch({ type: actions.SYSTEMS.SET_IPFS, ipfsStatus: 'Started' })

      initOrbitDB(ipfs).then(async (databases) => {
        dispatch({ type: actions.SYSTEMS.SET_ORBITDB, orbitdbStatus: 'Started' })

        const programs = await getAllDatabases()
        dispatch({ type: actions.PROGRAMS.SET_PROGRAMS, programs: programs.reverse() })
        dispatch({ type: actions.PROGRAMS.SET_PROGRAMS_LOADING, loading: false })
      })
    })
  }, [dispatch])

  return (
    <Pane background='white' elevation={1}>
      <Pane
        display='flex'
        flexDirection='row'
        alignItems='left'
        paddingX={majorScale(6)}
        paddingY={majorScale(1)}
      >
        <Pane display='flex' flexDirection='row' width='100%'>
          <Text
            display='flex'
            alignItems='center'
            fontWeight='600'
            marginRight={minorScale(1)}
          >
            Systems:
          </Text>
          {
            appState.ipfsStatus === 'Started'
              ? <StatusIndicator color='success'>IPFS</StatusIndicator>
              : <StatusIndicator color='warning'>IPFS</StatusIndicator>
          }
          {
            appState.orbitdbStatus === 'Started'
              ? <StatusIndicator color='success'>OrbitDB</StatusIndicator>
              : <StatusIndicator color='warning'>OrbitDB</StatusIndicator>
          }
          <ConnectToWalletButton style={{ marginLeft: 'auto' }} />
        </Pane>
      </Pane>
    </Pane>
  )
}

export default Systems
