import React from 'react'

import {
  minorScale,
  CrossIcon,
  DatabaseIcon,
  EyeOpenIcon,
  Icon,
  IconButton,
  Table,
  TrashIcon
} from 'evergreen-ui'

import { useHistory } from 'react-router-dom'
import { formatDistanceToNow } from 'date-fns'

const colors = {
   eventlog: '#47B881',
   feed: '#14B5D0',
   keyvalue: '#1070CA',
   docstore: '#D9822B',
   counter: '#735DD0'
}

function ProgramList ({ programs, onRemove }) {
  const history = useHistory()

  function handleSelect (program) {
    history.push(program.address)
  }

  return (
    <Table>
      <Table.Head padding='0'>
        <Table.TextHeaderCell
          flex='1 1 2%'
          textAlign='center'
          padding={minorScale(2)}
          alignItems='center'
        >
          <Icon icon={EyeOpenIcon} />
        </Table.TextHeaderCell>
        <Table.TextHeaderCell flex='1 1 10%' paddingX={0}>Name</Table.TextHeaderCell>
        <Table.TextHeaderCell flex='1 1 5%' paddingX={minorScale(1)}>Type</Table.TextHeaderCell>
        <Table.TextHeaderCell flex='1 1 40%' paddingX={0}>Address</Table.TextHeaderCell>
        <Table.TextHeaderCell flex='1 1 10%' paddingX={0}>Added</Table.TextHeaderCell>
        <Table.TextHeaderCell
          flex='1 1 2%'
          textAlign='center'
          padding={minorScale(2)}
          alignItems='center'
        >
          <Icon size={12} icon={TrashIcon} />
        </Table.TextHeaderCell>
      </Table.Head>
      <Table.Body>
        {programs.map(e => {
          const program = e.payload.value
          return (
            <Table.Row key={`program-id-${program.address}`}>
              <Table.Cell
                flex='1 1 2%'
                display='flex'
                flexDirection='row'
                justifyContent='center'
                padding={minorScale(2)}
              >
                <IconButton
                  appearance='minimal'
                  icon={DatabaseIcon}
                  margin={0}
                  padding={0}
                  onClick={() => handleSelect(program)}
                />
              </Table.Cell>
              <Table.TextCell flex='1 1 10%' paddingX={0}>{program.name}</Table.TextCell>
              <Table.TextCell flex='1 1 5%' paddingX={minorScale(1)} textProps={{ color: colors[program.type]}}>
                {program.type}
              </Table.TextCell>
              <Table.TextCell flex='1 1 40%' paddingX={0}>{program.address.toString() ? program.address.toString() : program.address}</Table.TextCell>
              <Table.TextCell flex='1 1 10%' paddingX={0}>{program.added ? formatDistanceToNow(program.added) + ' ago': 'Unknown'}</Table.TextCell>
              <Table.Cell
                flex='1 1 2%'
                display='flex'
                flexDirection='row'
                justifyContent='center'
                padding={minorScale(2)}
              >
                <IconButton
                  appearance='minimal'
                  icon={CrossIcon}
                  intent='danger'
                  margin={0}
                  padding={0}
                  onClick={() => onRemove(e.hash, program)}
                />
              </Table.Cell>
            </Table.Row>
        )})}
      </Table.Body>
    </Table>
  )
}

export default ProgramList
