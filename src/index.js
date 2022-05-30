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

let message = "Welcome..!"

io.on('connection', (socket) => {
    console.log('New WebSocket connection')

    socket.emit('userGreetings', (message))

    socket.on('sendMessage', (msgContent) => {
        io.emit('userGreetings', msgContent)
    })
 
})

server.listen(port, () => {
    console.log(`server is up on port ${port}!`);
})



