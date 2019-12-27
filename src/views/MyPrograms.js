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

import { getProgram, getAllPrograms, addProgram, removeProgram, createProgram } from '../database'

import ProgramList from '../components/ProgramList'
import CreateDialog from '../components/CreateDialog'

function MyProgramsView () {
  const [appState, dispatch] = useStateValue()
  const [loading, setLoading] = React.useState(false)

  async function fetchPrograms () {
    // dispatch({ type: actions.PROGRAMS.SET_PROGRAMS_LOADING, loading: true })
    const programs = await getAllPrograms()
    dispatch({ type: actions.PROGRAMS.SET_PROGRAMS, programs: programs.reverse() })
    // dispatch({ type: actions.PROGRAMS.SET_PROGRAMS_LOADING, loading: false })
    return programs
  }

  const handleCreateDatabase = () => {
    dispatch({ type: actions.DB.OPEN_CREATEDB_DIALOG })
  }

  const createDatabase = (args) => {
    console.log("Create database...", args)
    createProgram(args.name, args.type).then((hash) => {
      console.log("Created", hash)
      fetchPrograms().then((data) => {
        console.log("Loaded4", data)
      })
    })
  }

  const handleAddDatabase = () => {
    console.log("Add database...")
    // TODO
  }

  const handleRemoveDatabase = (hash, program) => {
    console.log("Remove database...", hash, program)
    removeProgram(hash).then(() => {
      console.log("Removed")
      fetchPrograms().then((data) => {
        console.log("Loaded3", data)
      })
    })
  }

  React.useEffect(() => {
    let canceled = false
    setLoading(true)
    fetchPrograms().then(data => {
      if (!canceled) {
        // setPrograms(data)
        setLoading(false)
        console.log("Loaded2", data)
      }
    })
    return () => {

      // setPrograms([])
      setLoading(false)
      console.log("Loaded1")
      canceled = true
    }
  }, [])

  return (
    <>
    <Pane marginX={majorScale(6)}>
      <Heading
        fontFamily='Titillium Web'
        color='#425A70'
        size={700}
        textTransform='uppercase'
        marginTop={majorScale(4)}
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
      marginBottom={majorScale(2)}
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
    <Pane display='flex' justifyContent='center'>
      <CreateDialog onCreate={createDatabase}/>
      <Pane
        flex='1'
        elevation={1}
        background='white'
        marginX={majorScale(6)}
      >
        {appState.user || true ? (
          !loading && appState.orbitdbStatus === 'Started' ? (
            <ProgramList 
              programs={appState.programs}
              onRemove={handleRemoveDatabase}
            />
          ) : (
            <Pane 
              display='flex' 
              flexDirection='column' 
              alignItems='center' 
              marginTop={majorScale(3)}
              marginBottom={majorScale(1)}
            >
              <Spinner size={24}/>
              <Text marginY={majorScale(1)}>Loading...</Text>
            </Pane>
          )
        ) : (
          <Pane display='flex' justifyContent='center' marginY={majorScale(6)}>
            <Text>Please sign in</Text>
          </Pane>
        )}
      </Pane>
    </Pane>
    </>
  )
}

export default MyProgramsView
