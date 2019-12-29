import React from 'react'
import { useHistory } from 'react-router-dom'
import {
  majorScale,
  Heading,
  Link,
  Pane,
  SearchInput
} from 'evergreen-ui'

function Header () {
  const history = useHistory()

  function handleKeyUp (event) {
    // TODO: Do not use "ENTER" key as the trigger, maybe onSubmit of a form
    if (event.keyCode === 13) history.push(`/search?q=${event.target.value}`)
  }

  return (
    <Pane background='white' elevation={1}>
      <Pane 
        className='row-wrap'
        display='flex'
        borderBottom='default'
      >
        <Pane
          className='align title'
          display='flex'
          flex='1 1 60%'
        >
          <Link 
            href='#/' 
            textDecoration='none' 
            display='flex' 
            flexDirection='row' 
            alignItems='center'
          >
            <img src='Orbit_round-02.png' width={majorScale(5)}/>
            <Heading size={800} fontFamily='Titillium Web' marginX={majorScale(2)}>
            CONTROL CENTER
            </Heading>
          </Link>
        </Pane>
        <Pane
          className='align search'
          display='flex'
          alignItems='center'
          justifyContent='center'
        >
          <SearchInput
            width='100%'
            flex='1 1 100%'
            placeholder='Search...'
            height={24}
            onKeyUp={handleKeyUp}
          />
        </Pane>
      </Pane>
    </Pane>
  )
}

export default Header
