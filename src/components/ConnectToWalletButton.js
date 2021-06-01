import React, { useState, useEffect } from 'react'
import { Button } from 'evergreen-ui'
import { truncateAddress, isMetaMask } from '../utils'

function ConnectToWalletButton (props) {
  const [address, setAddress] = useState(window.ethereum?.selectedAddress)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const firstAddress = (addr) => setAddress(addr[0])
    window.ethereum?.on('accountsChanged', firstAddress)

    return function cleanup () {
      window.ethereum?.removeListener('accountsChanged', firstAddress)
    }
  }, [])

  async function connectWallet (event) {
    setLoading(true)

    window.ethereum?.request({ method: 'eth_requestAccounts' })
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  if (!isMetaMask()) return null
  return (
    <Button
      intent={address ? 'success' : 'none'}
      style={props.style}
      isLoading={loading}
      onClick={connectWallet}
    >
      {address ? truncateAddress(address) : 'Connect wallet'}
    </Button>
  )
}

export default ConnectToWalletButton
