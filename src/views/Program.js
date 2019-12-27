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
  const [address] = React.useState(`/orbitdb/${programName}/${dbName}`)

  function handleValueChange (event) {
    setValue(event.target.value)
  }

  function handleAdd (event) {
    if (event) event.preventDefault()
    if (value.length === 0) return
    addToDB(value)
  }

  const handleSelect = (entry) => {
    setEntry(entry)
  }

  const handleBack = () => {
    if (appState.db) {
      appState.db.close().then(() => {
        dispatch({ type: actions.DB.SET_DB, db: null, entries: [] })
        history.goBack()
      })
    }
  }

  const fetchDB = async (address) => {
    const db = await getDB(address)
    let entries
    if (db.type === 'eventlog' || db.type === 'feed')
      entries = await db.iterator({ limit: 10 }).collect().reverse()
    else if (db.type === 'counter')
      entries = [{ payload: { value: db.value } }]
    else if (db.type === 'keyvalue')
      entries = Object.keys(db.all).map(e => ({ payload: { value: "" + e + ": " + db.get(e)}}))
    else if (db.type === 'docstore')
      entries = db.get('latest') ? [{ payload: { value: db.get('latest').pop() } }] : []
    else
      entries = [{ payload: { value: "TODO" } }]

    dispatch({ type: actions.DB.SET_DB, db, entries })
    console.log("GOT DB", db)
    console.log("entries", entries)
  }

  const addToDB = async (value) => {
    const db = await getDB(address)
    if (db.type === 'eventlog' || db.type === 'feed')
      await db.add(value)
    else if (db.type === 'counter') {
      const val = parseInt(value) || 1
      if (val > 0) await db.inc(val)
    }
    else if (db.type === 'keyvalue')
      await db.set('latest', value)
    else if (db.type === 'docstore')
      await db.put({_id: 'latest', value})

    let entries
    if (db.type === 'eventlog' || db.type === 'feed')
      entries = await db.iterator({ limit: 10 }).collect().reverse()
    else if (db.type === 'counter')
      entries = [{ payload: { value: db.value } }]
    else if (db.type === 'keyvalue')
      entries = Object.keys(db.all).map(e => ({ payload: { value: "" + e + ": " + db.get(e)}}))
    else if (db.type === 'docstore')
      entries = db.get('latest') ? [{ payload: { value: db.get('latest').pop() } }] : []
    else
      entries = [{ payload: { value: "TODO" } }]

    dispatch({ type: actions.DB.SET_DB, db, entries })
  }
  // const [dialogState, setDialogState] = useState({
  //   showDeployLocallyDialog: false,
  //   showDeployRemotelyDialog: false
  // })

  // function handleDialogClosed () {
  //   setDialogState({ showDeployLocallyDialog: false, showDeployRemotelyDialog: false })
  // }

  // function handleOpenDeployLocallyDialog () {
  //   const {name} = appState.program
  //   runProgram(name, programs[name])
  //   // setDialogState(Object.assign({}, dialogState, { showDeployLocallyDialog: true }))
  // }

  // function handleOpenDeployRemotelyDialog () {
  //   setDialogState(Object.assign({}, dialogState, { showDeployRemotelyDialog: true }))
  // }

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
    const program = appState.program.payload.value
    const info = appState.program
    return (
      <Pane marginTop={majorScale(2)}>
        <Pane flex='1' >
          <Text>Name: {program.name}</Text>
        </Pane>
        <Pane flex='1' >
          <Text>Type: </Text><Text color={colors[program.type]}>{program.type}</Text>
        </Pane>
        <Pane flex='1' >
          <Text>Entries: {appState.db ? appState.db._oplog.length : '-'}</Text>
        </Pane>
        <Pane 
          flex='1' 
          paddingBottom={majorScale(2)}
          marginBottom={majorScale(4)}
        >
          <Heading size={500}
            marginTop={majorScale(2)}
            marginBottom={majorScale(1)}
          >
            Latest 10
          </Heading>
          {appState.entries.map(e => {
            return (
              <>
              <Pane>
                <Text userSelect='none' cursor='pointer' onClick={() => handleSelect(e)}>{JSON.stringify(e.payload.value, null, 2)}</Text>
              </Pane>
              <Pane >
                {entry && entry.hash === e.hash
                  ? <Pre
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
          })}
        </Pane>
      </Pane>
    )
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
        {
          appState.program ? (
            renderProgram()
          ) : (
            <Text>Not Found</Text>
          )
        }
        <TextInput
          onChange={handleValueChange}
          name='value'
          placeholder='Value'
          height={24}
          width='20%'
        ></TextInput>
        <Button
          iconBefore='plus'
          appearance='none'
          height={24}
          marginLeft={majorScale(1)}
          onClick={handleAdd}
        >
          Add
        </Button>
      </Pane>
    </Pane>
    </>
  )
}

export default ProgramView
