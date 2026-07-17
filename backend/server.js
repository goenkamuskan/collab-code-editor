const { Server } = require('@hocuspocus/server')
const { Logger } = require('@hocuspocus/extension-logger')

const server = new Server({
  port: 1234,
  extensions: [
    new Logger(),
  ],
  async onConnect(data) {
    console.log(`✅ Client connected to room: ${data.documentName}`)
  },
  async onDisconnect(data) {
    console.log(`❌ Client disconnected from room: ${data.documentName}`)
  },
})

server.listen()
console.log('🚀 Hocuspocus server running on ws://localhost:1234')