import React, { useEffect } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import {
  majorScale,
  ArrowLeftIcon,
  Heading,
  IconButton,
  Pane,
  Pre,
  Spinner,
  Text
} from 'evergreen-ui'

import LogStoreControls from '../components/LogStoreControls'
import FeedStoreControls from '../components/FeedStoreControls'
import KeyValueStoreControls from '../components/KeyValueStoreControls'
import DocumentStoreControls from '../components/DocumentStoreControls'
import CounterStoreControls from '../components/CounterStoreControls'

import { getDB } from '../database'
import { useStateValue, actions } from '../state'

const colors = {
   eventlog: '#47B881',
   feed: '#14B5D0',
   keyvalue: '#1070CA',
   docstore: '#D9822B',
   counter: '#735DD0',
}

function ProgramView () {
  const { programName, dbName } = useParams()
  const [appState, dispatch] = useStateValue()
  const history = useHistory()
  const [index, setIndex] = React.useState(null)
  const [loading, setLoading] = React.useState(false)
  const [address] = React.useState(`/orbitdb/${programName}/${dbName}`)

  const handleSelect = (idx) => {
    setIndex(idx !== index ? idx : null)
  }

  const handleBack = () => {
    if (appState.db) {
      appState.db.close().then(() => {
        dispatch({ type: actions.PROGRAMS.SET_PROGRAM, program: null })
        dispatch({ type: actions.DB.SET_DB, db: null, entries: [] })
        history.goBack()
      })
    }
  }

  const fetchDB = async (address) => {
    setLoading(true)
    const db = await getDB(address)

    if (db) {
      let entries
      if (db.type === 'eventlog' || db.type === 'feed')
        entries = await db.iterator({ limit: 10 }).collect().reverse()
      else if (db.type === 'counter')
        entries = [{ payload: { value: db.value } }]
      else if (db.type === 'keyvalue')
        entries = Object.keys(db.all).map(e => ({ payload: { value: {key: e, value: db.get(e)} } }))
      else if (db.type === 'docstore')
        entries = db.query(e => e !== null, {fullOp: true}).reverse()
      else
        entries = [{ payload: { value: "TODO" } }]

      dispatch({ type: actions.DB.SET_DB, db, entries })
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDB(address)
    const program = appState.programs.find(p => p.payload.value.address === address)
    dispatch({ type: actions.PROGRAMS.SET_PROGRAM, program })
  }, [dispatch, address, appState.programs]) // eslint-disable-line

  function getValuesTitle() {
    const db = appState.program ? appState.program.payload.value : null
    if (!db) return

    if (db.type === 'eventlog')
      return "Latest 10 events"
    else if (db.type === 'feed')
      return "Latest 10 entries"
    else if (db.type === 'docstore')
      return "All Documents"
    else if (db.type === 'keyvalue')
      return "Keys and Values"
    else if (db.type === 'counter')
      return "Count"
    else
      return <Text intent='danger'>No input controls found for '{db.type}'</Text>
  }

  function renderProgram () {
    const program = appState.program ? appState.program.payload.value : null
    return (
      <Pane marginTop={majorScale(2)}>
        <Pane flex='1' >
          <Text>Name: {program ? program.name : '-'}</Text>
        </Pane>
        <Pane flex='1' >
          <Text>Type: </Text>
          {program
            ? <Text color={colors[program.type]}>{program.type}</Text>
            : <Text>-</Text>
          }
        </Pane>
        <Pane flex='1'>
          <Text>Permissions:</Text>
          {appState.db
            ? <pre>{appState.db.access.write}</pre>
            : <Text>-</Text>
          }
        </Pane>
        <Pane flex='1' flexDirection='row'>
          <Text>Entries: </Text>
          {appState.db
            ? <Text>{appState.db._oplog.length}</Text>
            : <Text>-</Text>
          }
        </Pane>
        <Pane
          flex='1'
          marginBottom={majorScale(2)}
        >
          <Heading size={500}
            marginTop={majorScale(2)}
            marginBottom={majorScale(1)}
          >
            {getValuesTitle()}
          </Heading>
          {loading
            ? <Spinner
                size={majorScale(2)}
                delay={100}
                marginY={majorScale(2)}
              />
            : appState.entries.map((e, idx) => {
                idx += 1
                return (
                  <div key={idx}>
                    <Pane>
                      <Text userSelect='none' cursor='pointer' onClick={() => handleSelect(idx)}>{JSON.stringify(e.payload.value, null, 2)}</Text>
                    </Pane>
                    <Pane>
                      {index && idx === index
                        ? <Pre
                            maxWidth={majorScale(96)}
                            overflow='auto'
                            fontFamily='Source Code Pro'
                            marginY={majorScale(1)}
                            paddingY={majorScale(1)}
                            backgroundColor='#FEF8E7'
                          >{JSON.stringify(e, null, 2)}</Pre>
                        : ''}
                    </Pane>
                  </div>
                )
              })
          }
        </Pane>
      </Pane>
    )
  }

  function renderDatabaseControls() {
    const db = appState.db
    if (!db) return

    if (db.type === 'eventlog')
      return <LogStoreControls />
    else if (db.type === 'feed')
      return <FeedStoreControls />
    else if (db.type === 'docstore')
      return <DocumentStoreControls />
    else if (db.type === 'keyvalue')
      return <KeyValueStoreControls />
    else if (db.type === 'counter')
      return <CounterStoreControls />
    else
      return <Text intent='danger'>No input controls found for '{db.type}'</Text>
  }

  return (
    <>
    <Pane
      marginTop={majorScale(3)}
      marginBottom={majorScale(2)}
      marginX={majorScale(1)}
      display='flex'
      flexDirection='row'
      alignItems='baseline'
    >
      <IconButton
        icon={ArrowLeftIcon}
        appearance='minimal'
        onClick={handleBack}
      />
      <Heading
        marginLeft={majorScale(1)}
        display='flex'
        fontFamily='Titillium Web'
        color='#425A70'
        size={700}
        textTransform='uppercase'
      >
        DATABASE
      </Heading>
    </Pane>
    <Pane display='flex' justifyContent='center'>
      <Pane
        flex='1'
        overflow='auto'
        elevation={1}
        background='white'
        marginX={majorScale(6)}
        padding={majorScale(4)}
      >
        <Pane borderBottom='default'>
          <Heading size={500} marginBottom={majorScale(1)} borderBottom='default' overflow='auto'>
            /orbitdb/{programName}/{dbName}
          </Heading>
        </Pane>
        <Pane>
          {renderProgram()}
        </Pane>
        <Pane>
          {appState.program ? (renderDatabaseControls()) : ''}
        </Pane>
      </Pane>
    </Pane>
  </>
  )
}

export default ProgramView
