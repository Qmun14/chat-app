const users = []

// addUser  removeUser getUser getUsersInRoom

const addUser = ({ id, username, room }) => {
    // Clean the data
    username = username.toLowerCase().trim()
    room = room.toLowerCase().trim()

    // validate the data
    if (!username || !room) {
        return {
            error : 'Username and Room are required!'
        }
    }

    // cek for existing user
    const existingUser = users.find((user) => {
        return user.room === room && user.username === username
    })

    // Validate username
    if(existingUser) {
        return {
            error : 'Username is in use!'
        }
    }

    // Store user
    const user = { id, username, room }
    users.push(user)
    return { user }
}

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id)

    if (index !== -1) {
        return users.splice(index, 1)[0]
    }
}

 addUser({
    id : 22,
    username : 'Qmun14    ',
    room : '   Bogor'
})

console.log(users);

const removedUser = removeUser(22)

console.log(removedUser)
console.log(users)