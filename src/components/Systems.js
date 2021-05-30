import React from 'react'
import {
  majorScale,
  minorScale,
  Link,
  Pane,
  Text,
  StatusIndicator
} from 'evergreen-ui'

import { initIPFS, initOrbitDB, getAllDatabases } from '../database'
import { actions, useStateValue } from '../state'

function Systems () {
  const [appState, dispatch] = useStateValue()


  React.useEffect(() => {
    dispatch({ type: actions.PROGRAMS.SET_PROGRAMS_LOADING, loading: true })

    initIPFS().then(async (ipfs) => {
      dispatch({ type: actions.SYSTEMS.SET_IPFS, ipfsStatus: 'Started'})

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
        flexDirection='column'
        alignItems='left'
        paddingX={majorScale(6)}
        paddingY={majorScale(1)}
      >
        <Link href='#/' textDecoration='none' display='flex' flexDirection='row'>
          <Text fontWeight='600' marginRight={minorScale(1)}>Systems:</Text>
          <Pane
            display='flex'
            alignItems='center'
            marginX={minorScale(1)}
          >
            {appState.ipfsStatus === 'Started'
              ? <StatusIndicator color="success">IPFS</StatusIndicator>
              : <StatusIndicator color="warning">IPFS</StatusIndicator>
            }
          </Pane>
          <Pane
            display='flex'
            alignItems='center'
            marginX={majorScale(1)}
          >
            {appState.orbitdbStatus === 'Started'
              ? <StatusIndicator color="success">OrbitDB</StatusIndicator>
              : <StatusIndicator color="warning">OrbitDB</StatusIndicator>
            }
          </Pane>
        </Link>
      </Pane>
    </Pane>
  )
}

export default Systems
