const socket = io()

socket.on('userGreetings', (hasilMessage) => {
    console.log(hasilMessage)
})

const formChat = document.querySelector('form')
const inputText = document.querySelector('#input')
formChat.addEventListener('submit', (e) => {
    e.preventDefault()
    let messageContent = inputText.value
    socket.emit('sendMessage', messageContent)
})

document.querySelector('#send-location').addEventListener('click', () => {
    if (!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser!')
    }
    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocation', {
            latitude : position.coords.latitude,
            longitude : position.coords.longitude
        })
    })
})