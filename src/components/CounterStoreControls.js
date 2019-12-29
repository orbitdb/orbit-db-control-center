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
  const [value, setValue] = useState(1)

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

    if (db.type !== 'counter') {
      throw new Error('This component can only handle Counter databases')
    }

    const val = parseInt(value) || 0

    if (val > 0) {
      await db.inc(val)
    }

    const entries = [{ payload: { value: db.value } }]
    dispatch({ type: actions.DB.SET_DB, db, entries })
  }

  return (
    <Pane
      flex='1'
    >
      <Heading marginBottom={majorScale(1)}>Increment the value of the counter</Heading>
      <TextInput
        onChange={handleValueChange}
        name='value'
        defaultValue={1}
        placeholder='amount'
        height={24}
        width='10%'
      ></TextInput>
      <Button
        iconBefore='plus'
        appearance='default'
        height={24}
        marginLeft={majorScale(1)}
        onClick={handleAdd}
      >
        Increment
      </Button>
    </Pane>
  )
}

export default KeyValueStoreControls
