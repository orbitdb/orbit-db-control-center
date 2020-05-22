import React from 'react'
import { 
  majorScale,
  minorScale,
  Button,
  Heading,
  Pane,
  Spinner,
  Text
} from 'evergreen-ui'

import { useStateValue, actions } from '../state'

import { getAllDatabases, addDatabase, removeDatabase, createDatabase } from '../database'

import ProgramList from '../components/DatabaseList'
import CreateDialog from '../components/CreateDialog'
import AddDialog from '../components/AddDialog'

function DatabasesView () {
  const [appState, dispatch] = useStateValue()

  async function fetchDatabases () {
    dispatch({ type: actions.PROGRAMS.SET_PROGRAMS_LOADING, loading: true })
    const programs = await getAllDatabases()
    dispatch({ type: actions.PROGRAMS.SET_PROGRAMS, programs: programs.reverse() })
    dispatch({ type: actions.PROGRAMS.SET_PROGRAMS_LOADING, loading: false })
    return programs
  }

  const handleCreateDatabase = () => {
    dispatch({ type: actions.DB.OPEN_CREATEDB_DIALOG })
  }

  const createDB = (args) => {
    console.log("Create database...", args)
    createDatabase(args.name, args.type, args.permissions).then((hash) => {
      console.log("Created", hash)
      fetchDatabases().then((data) => {
        console.log("Loaded programs", data)
      })
    })
  }

  const handleAddDatabase = (args) => {
    dispatch({ type: actions.DB.OPEN_ADDDB_DIALOG })
  }

  const addDB = (args) => {
    console.log("Add database...", args)
    addDatabase(args.address).then((hash) => {
      console.log("Added", args.address)
      fetchDatabases().then((data) => {
        console.log("Loaded programs", data)
      })
    })
  }

  const handleRemoveDatabase = (hash, program) => {
    console.log("Remove database...", hash, program)
    removeDatabase(hash).then(() => {
      console.log("Removed")
      fetchDatabases().then((data) => {
        console.log("Loaded programs", data)
      })
    })
  }

  return (
    <>
    <Pane marginX={majorScale(6)}>
      <Heading
        fontFamily='Titillium Web'
        color='#425A70'
        size={700}
        textTransform='uppercase'
        marginTop={majorScale(3)}
        marginBottom={majorScale(2)}
      >
        Databases
      </Heading>
    </Pane>
    <Pane 
      display='flex' 
      flexDirection='row'
      marginX={majorScale(6)}
      marginTop={majorScale(2)}
      marginBottom={majorScale(1)}
    >
      <Button
        iconBefore='document'
        appearance='default'
        height={24}
        onClick={handleCreateDatabase}
      >
        Create
      </Button>
      <Button
        iconBefore='plus'
        appearance='default'
        height={24}
        marginLeft={minorScale(1)}
        onClick={handleAddDatabase}
      >
        Open
      </Button>
    </Pane>
    <Pane display='flex' justifyContent='center' overflow='auto'>
      <CreateDialog onCreate={createDB}/>
      <AddDialog onAdd={addDB}/>
      <Pane
        flex='1'
        overflow='auto'
        elevation={1}
        background='white'
        marginX={majorScale(6)}
      >
        {!appState.loading.programs 
          ? (<ProgramList
              programs={appState.programs}
              onRemove={handleRemoveDatabase}
            />)
          : (<Pane
              display='flex' 
              flexDirection='column' 
              alignItems='center' 
              marginTop={majorScale(3)}
              marginBottom={majorScale(1)}
            >
              <Spinner size={24}/>
              <Text marginY={majorScale(1)}>Loading...</Text>
            </Pane>)
        }
      </Pane>
    </Pane>
    </>
  )
}

export default DatabasesView
