import React from 'react'
import { Pane } from 'evergreen-ui'
import { Route, Switch } from 'react-router-dom'

import { actions, useStateValue, loadingState, StateProvider } from './state'

import Status from './components/Status'
import Header from './components/Header'

import IndexView from './views/Index'
import ProgramView from './views/Program'
import MyProgramsView from './views/MyPrograms'
import SearchResultsView from './views/SearchResults'

function App () {
  const initialState = {
    user: null,
    loginDialogOpen: false,
    createDBDialogOpen: false,
    programs: [],
    program: false,
    db: null,
    entries: [],
    orbitdbStatus: 'Starting',
    ipfsStatus: 'Starting',
    loading: {
      programs: false
    }
  }

  const reducer = (state, action) => {
    switch (action.type) {
      case actions.AUTH.OPEN_LOGIN_DIALOG:
        return {
          ...state,
          loginDialogOpen: true
        }
      case actions.AUTH.CLOSE_LOGIN_DIALOG:
        return {
          ...state,
          loginDialogOpen: false
        }
      case actions.AUTH.SET_USER:
        return {
          ...state,
          user: action.user
        }
      case actions.SYSTEMS.SET_ORBITDB:
        return {
          ...state,
          orbitdbStatus: action.orbitdbStatus
        }
      case actions.SYSTEMS.SET_IPFS:
        return {
          ...state,
          ipfsStatus: action.ipfsStatus
        }
      case actions.PROGRAMS.SET_PROGRAM:
        return {
          ...state,
          program: action.program
        }
      case actions.PROGRAMS.SET_PROGRAM_LOADING:
        return {
          ...state,
          program: loadingState
        }
      case actions.PROGRAMS.SET_PROGRAMS:
        return {
          ...state,
          programs: action.programs
        }
      case actions.DB.SET_DB:
        return {
          ...state,
          db: action.db,
          entries: action.entries,
        }
      case actions.DB.OPEN_CREATEDB_DIALOG:
        return {
          ...state,
          createDBDialogOpen: true
        }
      case actions.DB.CLOSE_CREATEDB_DIALOG:
        return {
          ...state,
          createDBDialogOpen: false
        }
      case actions.PROGRAMS.SET_PROGRAMS_LOADING:
        return {
          ...state,
          loading: { ...state.loading, programs: action.loading }
        }
      // case actions.PROGRAMS.SET_POPULAR:
      //   return {
      //     ...state,
      //     popularPrograms: action.popularPrograms
      //   }
      // case actions.PROGRAMS.SET_POPULAR_LOADING:
      //   return {
      //     ...state,
      //     popularPrograms: loadingState
      //   }
      // case actions.PROGRAMS.SET_CATEGORIES:
      //   return {
      //     ...state,
      //     categories: action.categories
      //   }
      // case actions.PROGRAMS.SET_CATEGORIES_LOADING:
      //   return {
      //     ...state,
      //     categories: loadingState
      //   }
      // case actions.PROGRAMS.SET_STATS:
      //   return {
      //     ...state,
      //     stats: action.stats
      //   }
      // case actions.PROGRAMS.SET_STATS_LOADING:
      //   return {
      //     ...state,
      //     stats: loadingState
      //   }
      default:
        return state
    }
  }

  return (
    <StateProvider initialState={initialState} reducer={reducer}>
      <Pane background='tint1' height='100%'>
        <Header />
        <Status />
        <Switch>
          <Route path='/search'>
            <SearchResultsView />
          </Route>
          <Route path='/orbitdb/:programName/:dbName'>
            <ProgramView />
          </Route>
          <Route path='/my-programs'>
            <IndexView />
          </Route>
          <Route path='/'>
            <MyProgramsView />
          </Route>
        </Switch>
      </Pane>
    </StateProvider>
  )
}

export default App
