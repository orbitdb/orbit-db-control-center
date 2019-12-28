import React, { useState } from 'react'
import {
  majorScale,
  Button,
  Heading,
  Pane,
  TextInput
} from 'evergreen-ui'

import { useStateValue, actions } from '../state'

function DocumentStoreControls () {
  const [appState, dispatch] = useStateValue()
  const [key, setKey] = useState('')
  const [value, setValue] = useState('')

  function handleValueChange (event) {
    setValue(event.target.value)
  }

  function handleKeyChange (event) {
    setKey(event.target.value)
  }

  function handleAdd (event) {
    if (event) event.preventDefault()
    if (value.length === 0) return
    if (key.length === 0) return
    addToDB()
  }

  const addToDB = async () => {
    const db = appState.db

    if (db.type !== 'docstore') {
      throw new Error('This component can only handle Document databases')
    }

    await db.put({_id: key, value})

    const entries = db.query(e => e !== null, {fullOp: true}).reverse()
    dispatch({ type: actions.DB.SET_DB, db, entries })
  }

  return (
    <Pane
      flex='1'
    >
      <Heading marginBottom={majorScale(1)}>Add a document to the database</Heading>
      <TextInput
        onChange={handleKeyChange}
        name='key'
        placeholder='_id'
        height={24}
        width='20%'
      ></TextInput>
      <TextInput
        onChange={handleValueChange}
        name='value'
        placeholder='document'
        height={24}
        width='20%'
        marginLeft={majorScale(1)}
      ></TextInput>
      <Button
        iconBefore='plus'
        appearance='default'
        height={24}
        marginLeft={majorScale(1)}
        onClick={handleAdd}
      >
        Put
      </Button>
    </Pane>
  )
}

export default DocumentStoreControls
