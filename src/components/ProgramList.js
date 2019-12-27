import React from 'react'

import { 
  majorScale,
  Button,
  IconButton,
  Table
 } from 'evergreen-ui'

import { useHistory } from 'react-router-dom'
import {formatDistanceToNow, formatRFC7231} from 'date-fns'

const colors = {
   eventlog: '#47B881',
   feed: '#14B5D0',
   keyvalue: '#1070CA',
   docstore: '#D9822B',
   counter: '#735DD0',
}

function ProgramList ({ programs, onRemove }) {
  const history = useHistory()

  function handleSelect (program) {
    history.push(program.address)
  }

  return (
    <Table>
      <Table.Head padding='0'>
        <Table.TextHeaderCell>Name</Table.TextHeaderCell>
        <Table.TextHeaderCell>Type</Table.TextHeaderCell>

        <Table.TextHeaderCell flex='1 1 30%'>Address</Table.TextHeaderCell>
        <Table.TextHeaderCell>Added On</Table.TextHeaderCell>
        <Table.TextHeaderCell>Actions</Table.TextHeaderCell>
      </Table.Head>
      <Table.Body>
        {programs.map(e => {
          const program = e.payload.value
          return (
            <Table.Row key={`program-id-${program.address}`}>
              <Table.TextCell>{program.name}</Table.TextCell>
              <Table.TextCell textProps={{ 
                color: colors[program.type]
              }}>{program.type}</Table.TextCell>
              <Table.TextCell flex='1 1 30%' isSelectable onSelect={() => handleSelect(program)}>{program.address.toString() ? program.address.toString() : program.address}</Table.TextCell>
              <Table.TextCell>{program.added ? formatDistanceToNow(program.added) + ' ago': 'Unknown'}</Table.TextCell>
              <Table.Cell display='flex' flexDirection='row'>
                <IconButton  appearance="minimal" icon="arrow-right" onClick={() => handleSelect(program)}/>
                <IconButton  appearance="minimal" icon="cross" intent="danger" onClick={() => onRemove(e.hash, program)}/>
              </Table.Cell>
            </Table.Row>
        )})}
      </Table.Body>
    </Table>
  )
}

export default ProgramList
