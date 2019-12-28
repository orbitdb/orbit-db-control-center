import React from 'react'
import { 
  Dialog, 
  TextInput 
} from 'evergreen-ui'

import { useStateValue, actions } from '../state'

function AddDialog ({ onAdd }) {
  const [appState, dispatch] = useStateValue()
  const [address, setAddress] = React.useState('')

  function handleSubmit (event) {
    if (event) event.preventDefault()
    if (address.length === 0) return
    console.log("Add:", address)
    onAdd({ address })
    dispatch({ type: actions.DB.CLOSE_ADDDB_DIALOG })
  }

  function handleAddressChange (event) {
    setAddress(event.target.value)
  }

  return (
    <Dialog
      isShown={appState.addDBDialogOpen}
      title='Add Database'
      onCloseComplete={() => dispatch({ type: actions.DB.CLOSE_ADDDB_DIALOG })}
      cancelLabel='Cancel'
      confirmLabel='Add'
      onConfirm={close => handleSubmit(null, close)}
    >
      <form onSubmit={handleSubmit}>
          <TextInput
            onChange={handleAddressChange}
            name='address'
            placeholder='Address'
            width='100%'
          ></TextInput>
      </form>
    </Dialog>
  )
}

export default AddDialog
