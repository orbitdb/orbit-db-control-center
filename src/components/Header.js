import React from 'react'
import { useHistory } from 'react-router-dom'
import {
  majorScale,
  minorScale,
  Heading,
  Icon,
  Link,
  Menu,
  Pane,
  Popover,
  Position,
  SearchInput,
  Text
} from 'evergreen-ui'

import { actions, useStateValue } from '../state'

function Header () {
  const history = useHistory()
  const [appState, dispatch] = useStateValue()

  function handleKeyUp (event) {
    // TODO: Do not use "ENTER" key as the trigger, maybe onSubmit of a form
    if (event.keyCode === 13) history.push(`/search?q=${event.target.value}`)
  }

  return (
    <Pane background='white' elevation={1}>
      <Pane display='flex' flexDirection='row'>
        <Pane
          display='flex'
          flex='1 1 60%'
          paddingLeft={majorScale(6)}
          paddingY={majorScale(1)}
          borderBottom='default'
        >
          <Link 
            href='#/' 
            textDecoration='none' 
            display='flex' 
            flexDirection='row' 
            alignItems='center'
          >
            <img src='Orbit_round-02.png' width={majorScale(4)}/>
            <Heading size={800} fontFamily='Titillium Web' marginX={majorScale(2)}>CONTROL CENTER</Heading>
          </Link>
        </Pane>
        <Pane
          display='flex'
          flex='1 1 40%'
          alignItems='center'
          justifyContent='center'
          paddingRight={majorScale(6)}
        >
          <SearchInput 
            placeholder='Search...' 
            height={24}
            width='100%' 
            onKeyUp={handleKeyUp} 
          />
        </Pane>
      </Pane>
    </Pane>
  )
}

export default Header
