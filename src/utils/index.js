function truncateAddress (address) {
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
}

function isMetaMask () { return window.ethereum?.isMetaMask }

export {
  isMetaMask,
  truncateAddress
}
