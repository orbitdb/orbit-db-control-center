import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { majorScale, Heading, Pane, Text, Spinner } from 'evergreen-ui'
import { useStateValue, actions, loadingState } from '../state'

function IndexView () {
  const [appState, dispatch] = useStateValue()

  return (
    <Pane display='flex' justifyContent='center'>
      <Pane
        flex='1'
        display='flex'
        flexDirection='row'
        justifyContent='space-between'
        margin={majorScale(6)}
      >
        <Pane
          elevation={1}
          width='30%'
          background='white'
          padding={majorScale(2)}
          flexDirection='column'
          display='flex'
        >
          <Heading>Popular Programs</Heading>
          <hr color='red' width='100%' />
          {appState.popularPrograms !== loadingState ? appState.popularPrograms.length &&
            appState.popularPrograms.map(program => (
              <Link to={`program/${program.name}`} key={`popular-program-${program.name}`}><Text>{program.name}</Text></Link>
            )) : <Spinner />}
        </Pane>
        <Pane
          elevation={1}
          width='30%'
          background='white'
          padding={majorScale(2)}
          flexDirection='column'
          display='flex'
        >
          <Heading>Discover Programs</Heading>
          <hr color='orange' width='100%' />
          {appState.categories !== loadingState ? appState.categories.length &&
            appState.categories.map(program => (
              <Link to={`category/${program.name}`} key={`category-${program.name}`}><Text size={500}>{program.name}</Text></Link>
            )) : <Spinner />}
        </Pane>
        <Pane
          elevation={1}
          width='30%'
          background='white'
          padding={majorScale(2)}
          flexDirection='column'
          display='flex'
        >
          <Heading>By The Numbers</Heading>
          <hr color='lightblue' width='100%' />
          <Text size={300}>Programs</Text>
          <Text size={600}>16,902</Text>
          <br />
          <Text size={300}>Live Services</Text>
          <Text size={600}>64,096</Text>
          <br />
          <Text size={300}>Service Providers</Text>
          <Text size={600}>2,512</Text>
          <br />
          <Text size={300}>Deployments - Last Month</Text>
          <Text size={600}>32,331,857</Text>
          <br />
        </Pane>
      </Pane>
    </Pane>
  )
}

export default IndexView
