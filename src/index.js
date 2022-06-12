const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')
const { generateMessage, generateLocationMessage } = require('./utils/messages')
const { addUser, getUser, getUsersInRoom, removeUser } = require('./utils/users')

const app = express()
const server = http.createServer(app) //refactoring proses code,, tanpa ini pun express tetap membuat server nya dibelakang layar
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))


io.on('connection', (socket) => {
    console.log('New WebSocket connection')

    

    socket.on('join',  (options, callback) => {
        const { error, user} = addUser({ id : socket.id, ...options })

        if (error) {
            return callback(error)
        }

        socket.join(user.room)

        socket.emit('userGreetings', generateMessage('Welcome!'))
        socket.broadcast.to(user.room).emit('userGreetings', generateMessage(`${user.username} has joined!`))

        callback()
    })

    socket.on('sendMessage', (msgContent, callback) => {
        const filter = new Filter()

        if (filter.isProfane(msgContent)) {
            return callback('Profanity is not allowed!')
        }

        io.emit('userGreetings', generateMessage(msgContent))
        callback()
    })

    socket.on('disconnect', () => {
        const user = removeUser(socket.id)

        if (user) {
            io.to(user.room).emit('userGreetings', generateMessage(`${user.username} has left!`))
        }

    })

    socket.on('sendLocation', (coords, callback) => {
        io.emit('locationMessage', generateLocationMessage(`https://google.com/maps?q=${coords.latitude},${coords.longitude}`))
        callback()
    })
})

server.listen(port, () => {
    console.log(`server is up on port ${port}!`);
})



