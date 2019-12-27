import React from 'react'
import { useHistory } from 'react-router-dom'
import {
  majorScale,
  minorScale,
  Heading,
  Icon,
  Link,
  Menu,
  Pane,
  Popover,
  Position,
  SearchInput,
  Spinner,
  Text
} from 'evergreen-ui'

import { initIPFS, initOrbitDB, getAllPrograms } from '../database'
import { actions, useStateValue } from '../state'

function Status () {
  const history = useHistory()
  const [appState, dispatch] = useStateValue()
  const [loading, setLoading] = React.useState(false)


  React.useEffect(() => {
    initIPFS().then(async (ipfs) => {
      dispatch({ type: actions.SYSTEMS.SET_IPFS, ipfsStatus: 'Started'})
  
      initOrbitDB(ipfs).then(async (databases) => {
        dispatch({ type: actions.PROGRAMS.SET_PROGRAMS_LOADING, loading: true })
        const programs = await getAllPrograms()
        dispatch({ type: actions.SYSTEMS.SET_ORBITDB, orbitdbStatus: 'Started' })
        dispatch({ type: actions.PROGRAMS.SET_PROGRAMS, programs: programs.reverse() })
        dispatch({ type: actions.PROGRAMS.SET_PROGRAMS_LOADING, loading: false })
      })
    })
  }, [])

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
          <Text fontWeight='700' marginRight={majorScale(1)}>Systems</Text>
          <Text fontWeight='700'>|</Text>
          <Pane
            display='flex'
            marginX={majorScale(1)}
          >
            <Text paddingRight={minorScale(1)}>IPFS: </Text>
            <Text color={appState.ipfsStatus !== 'Started' ? 'warning' : 'success'}>{appState.ipfsStatus}</Text>
          </Pane>
          <Text fontWeight='700'>|</Text>
          <Pane
            display='flex'
            marginX={majorScale(1)}
          >
            <Text paddingRight={minorScale(1)}>OrbitDB: </Text>
            <Text color={appState.orbitdbStatus !== 'Started' ? 'warning' : 'success'}>{appState.orbitdbStatus}</Text>
          </Pane>
        </Link>
      </Pane>
    </Pane>
  )
}

export default Status
