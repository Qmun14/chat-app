const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')

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
    socket.broadcast.emit('userGreetings', 'A new User has Joined!')

    socket.on('sendMessage', (msgContent, callback) => {
        const filter = new Filter()

        if (filter.isProfane(msgContent)) {
            return callback('Profanity is not allowed!')
        }

        io.emit('userGreetings', msgContent)
        callback()
    })

    socket.on('disconnect', () => {
        io.emit('userGreetings', 'A User has left!')
    })

    socket.on('sendLocation', (coords, callback) => {
        io.emit('locationMessage', `https://google.com/maps?q=${coords.latitude},${coords.longitude}`)
        callback()
    })
})

server.listen(port, () => {
    console.log(`server is up on port ${port}!`);
})



