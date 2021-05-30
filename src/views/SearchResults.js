import React from 'react'
import { majorScale, Heading, Pane, Spinner } from 'evergreen-ui'
import { useLocation, Redirect } from 'react-router-dom'
import { useStateValue, actions, loadingState } from '../state'

import { getAllDatabases, removeDatabase } from '../database'

import ProgramList from '../components/DatabaseList'

function useQuery () {
  return new URLSearchParams(useLocation().search)
}

function SearchResultsView () {
  const [appState, dispatch] = useStateValue()

  const query = useQuery().get('q')
  const queryOk = query.length >= 1

  if (!queryOk) return <Redirect to='/' />

  let programs = appState.programs
  if (query) {
    programs = programs.filter(({ payload: { value: { name, type, address } } }) =>
      name.includes(query) || type.includes(query) || address.toString().includes(query)
    )
  }

  async function fetchDatabases () {
    dispatch({ type: actions.PROGRAMS.SET_PROGRAMS_LOADING, loading: true })
    const programs = await getAllDatabases()
    dispatch({ type: actions.PROGRAMS.SET_PROGRAMS, programs: programs.reverse() })
    dispatch({ type: actions.PROGRAMS.SET_PROGRAMS_LOADING, loading: false })
    return programs
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
    <Pane display='flex' justifyContent='center'>
      <Pane
        flex='1'
        elevation={1}
        background='white'
        margin={majorScale(6)}
        padding={majorScale(4)}
      >
        <Pane borderBottom='default'>
          <Heading size={600} marginBottom={majorScale(1)}>
            {programs.length} programs found
          </Heading>
        </Pane>
        {programs !== loadingState
          ? <ProgramList programs={programs} onRemove={handleRemoveDatabase} />
          : <Spinner marginX='auto' marginY={120} />}
      </Pane>
    </Pane>
  )
}

export default SearchResultsView
