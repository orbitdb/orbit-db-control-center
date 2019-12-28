import React, { useState, useEffect } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import {
  majorScale,
  Button,
  Code,
  Heading,
  Icon,
  IconButton,
  Link,
  Pane,
  Paragraph,
  Pre,
  Spinner,
  Strong,
  Text,
  TextInput
} from 'evergreen-ui'

import LogStoreControls from '../components/LogStoreControls'
import KeyValueStoreControls from '../components/KeyValueStoreControls'
import DocumentStoreControls from '../components/DocumentStoreControls'
import CounterStoreControls from '../components/CounterStoreControls'

import { getDB } from '../database'
import { useStateValue, actions, loadingState } from '../state'
import formatDistance from 'date-fns/formatDistance'

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
  const [value, setValue] = React.useState('')
  const [entry, setEntry] = React.useState(null)
  const [loading, setLoading] = React.useState(false)
  const [address] = React.useState(`/orbitdb/${programName}/${dbName}`)

  function handleValueChange (event) {
    setValue(event.target.value)
  }

  const handleSelect = (entry) => {
    setEntry(entry)
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

  useEffect(() => {
    fetchDB(address)
    const program = appState.programs.find(p => p.payload.value.address === address)
    dispatch({ type: actions.PROGRAMS.SET_PROGRAM, program })
  }, [dispatch, programName, dbName])

  function renderDbType (db) {
    if (db && db.type === 'eventlog') 
      return 'EVENT LOG'
    else if (db && db.type === 'feed') 
      return 'FEED'
    else if (db && db.type === 'keyvalue') 
      return 'KEY-VALUE STORE'
    else if (db && db.type === 'docstore') 
      return 'DOCUMENT STORE'
    else if (db && db.type === 'counter') 
      return 'COUNTER'
    else 
      return ''
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
        <Pane flex='1' flexDirection='row'>
          <Text>Entries: </Text>
          {appState.db 
            ? <Text>{appState.db._oplog.length}</Text>
            : <Text>-</Text>
          }
        </Pane>
        <Pane 
          flex='1' 
          paddingBottom={majorScale(2)}
          marginBottom={majorScale(2)}
        >
          <Heading size={500}
            marginTop={majorScale(2)}
            marginBottom={majorScale(1)}
          >
            Latest 10
          </Heading>
          {loading
            ? <Spinner 
                size={majorScale(2)} 
                delay={100} 
                marginY={majorScale(2)}
              />
            : appState.entries.map(e => {
                return (
                  <>
                  <Pane key={e.hash + '-1'}>
                    <Text key={e.hash + '-2'} userSelect='none' cursor='pointer' onClick={() => handleSelect(e)}>{JSON.stringify(e.payload.value, null, 2)}</Text>
                  </Pane>
                  <Pane key={e.hash + '-3'}>
                    {entry && entry.hash === e.hash
                      ? <Pre
                          key={entry.hash}
                          maxWidth={majorScale(96)}
                          overflow='auto'
                          fontFamily='Source Code Pro'
                          marginY={majorScale(1)}
                          paddingY={majorScale(1)}
                          backgroundColor='#FEF8E7'
                          onClick={() => handleSelect(null)}
                        >{JSON.stringify(e, null, 2)}</Pre>
                      : ''}
                  </Pane>
                  </>
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

    if (db.type === 'eventlog' || db.type === 'feed')
      return <LogStoreControls />
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
      marginTop={majorScale(4)}
      marginBottom={majorScale(2)}
      marginX={majorScale(1)}
      display='flex'
      flexDirection='row'
      alignItems='baseline'
    >
      <IconButton
        icon='arrow-left'
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
        elevation={1}
        background='white'
        marginX={majorScale(6)}
        padding={majorScale(4)}
      >
        <Pane borderBottom='default'>
          <Heading size={500} marginBottom={majorScale(1)} borderBottom='default'>
            /orbitdb/{programName}/{dbName}
          </Heading>
        </Pane>
        {renderProgram()}
        {appState.program ? (renderDatabaseControls()) : ''}
      </Pane>
    </Pane>
  </>
  )
}

export default ProgramView
