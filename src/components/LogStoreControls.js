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

function EventLogControls () {
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
    addToDB()
  }

  const addToDB = async () => {
    const db = appState.db

    if (db.type !== 'eventlog' && db.type !== 'feed') {
      throw new Error('This component can only handle Log and Feed databases')
    }

    await db.add(value)

    const entries = await db.iterator({ limit: 10 }).collect().reverse()
    dispatch({ type: actions.DB.SET_DB, db, entries })
  }

  return (
    <Pane
      flex='1'
    >
      <Heading marginBottom={majorScale(1)}>Add an event to the log database</Heading>
      <TextInput
        onChange={handleValueChange}
        name='value'
        placeholder='Value'
        height={24}
        width='30%'
      ></TextInput>
      <Button
        iconBefore='plus'
        appearance='default'
        height={24}
        marginLeft={majorScale(1)}
        onClick={handleAdd}
      >
        Add
      </Button>
    </Pane>
  )
}

export default EventLogControls
