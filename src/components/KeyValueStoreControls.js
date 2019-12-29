import React, { useState } from 'react'
import {
  majorScale,
  Button,
  Heading,
  Pane,
  TextInput
} from 'evergreen-ui'

import { useStateValue, actions } from '../state'

function KeyValueStoreControls () {
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

    if (db.type !== 'keyvalue') {
      throw new Error('This component can only handle Key-Value databases')
    }

    await db.set(key, value)

    const entries = Object.keys(db.all).map(e => ({ payload: { value: {key: e, value: db.get(e)} } }))
    dispatch({ type: actions.DB.SET_DB, db, entries })
  }

  return (
    <Pane
      flex='1'
    >
      <Heading marginBottom={majorScale(1)}>Set a value for a key</Heading>
      <TextInput
        onChange={handleKeyChange}
        name='key'
        placeholder='key'
        height={24}
        width='20%'
      ></TextInput>
      <TextInput
        onChange={handleValueChange}
        name='value'
        placeholder='value'
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
        Set
      </Button>
    </Pane>
  )
}

export default KeyValueStoreControls
