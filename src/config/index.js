const config = {
  ipfs: {
    preload: {
      enabled: false
    },
    config: {
      Addresses: {
        Swarm: ['/dns4/wrtc-star1.par.dwebops.pub/tcp/443/wss/p2p-webrtc-star']
      }
    }
  }
}

export default config
