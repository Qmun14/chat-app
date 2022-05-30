const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')

const app = express()
const server = http.createServer(app) //refactoring proses code,, tanpa ini pun express tetap membuat server nya dibelakang layar
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))

let count = 0

// server (emit) -> client (receive) - countUpdated
// client (emit) -> server (receive) - increment

io.on('connection', (socket) => {
    console.log('New WebSocket connection')

    socket.emit('countUpdated', count)

    socket.on('increment', () => {
        count++
        // socket.emit('countUpdated', count) --> ini gak guna karena client baru tidak realtime updated! pake yg io.emit aja
        io.emit('countUpdated', count)
    })
})

server.listen(port, () => {
    console.log(`server is up on port ${port}!`);
})



