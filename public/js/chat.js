const socket = io()

// server (emit) -> client (receive) ---acknowledgement -> server
// client (emit) -> server (receive) ---acknowledgement -> client

// Elements
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $buttonLocation = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')

//  Templates
const messageTemplates = document.querySelector('#message-template').innerHTML
const locationTemplates = document.querySelector('#location-template').innerHTML

// Options
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })

socket.on('userGreetings', (hasilMessage) => {
    console.log(hasilMessage)
    const html = Mustache.render(messageTemplates, {
        hasilMessage : hasilMessage.text,
        createdAt : moment(hasilMessage.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML("beforeend", html)
})

socket.on('locationMessage', (loc) => {
    console.log(loc)
    const html = Mustache.render(locationTemplates, {
        loc : loc.url,
        createdAt : moment(loc.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML("beforeend", html)
})

const inputText = document.querySelector('#input')
$messageForm.addEventListener('submit', (e) => {
    e.preventDefault()
    $messageFormButton.setAttribute('disabled', 'disabled')
    let messageContent = inputText.value
    socket.emit('sendMessage', messageContent, (error) => {
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()
        if (error) {
            return console.log(error)
        }
        console.log('Message delivered!')
    })
})

$buttonLocation.addEventListener('click', () => {
    if (!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser!')
    }
    $buttonLocation.setAttribute('disabled', 'disabled')
    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocation', {
            latitude : position.coords.latitude,
            longitude : position.coords.longitude
        }, () => {
            $buttonLocation.removeAttribute('disabled')
            console.log('Location shared!');
        })
    })
})

socket.emit('join', { username, room }, (error) => {
    if (error) {
        alert(error)
        location.href= '/'
    }
})