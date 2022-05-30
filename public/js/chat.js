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