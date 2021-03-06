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
const sidebarTemplates = document.querySelector('#sidebar-template').innerHTML

// Options
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })

const autoscroll = () => {
    // New Message Element
    const $newMessage = $messages.lastElementChild

    // Height of the new message
    const newMessageStyle = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyle.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    // Visible Height
    const visibleHeight = $messages.offsetHeight

    // Height of messages container
    const containerHeight = $messages.scrollHeight

    // How far have I scrolled?
    const scrollOffset = $messages.scrollTop + visibleHeight

    if (containerHeight - newMessageHeight <= scrollOffset) {
        $messages.scrollTop = $messages.scrollHeight
    }

}

socket.on('userGreetings', (hasilMessage) => {
    console.log(hasilMessage)
    const html = Mustache.render(messageTemplates, {
        username : hasilMessage.username,
        hasilMessage : hasilMessage.text,
        createdAt : moment(hasilMessage.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML("beforeend", html)
    autoscroll()
})

socket.on('locationMessage', (loc) => {
    console.log(loc)
    const html = Mustache.render(locationTemplates, {
        username : loc.username,
        loc : loc.url,
        createdAt : moment(loc.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML("beforeend", html)
    autoscroll()
})

socket.on('roomData', ({ room, users }) => {
    const html = Mustache.render(sidebarTemplates, {
        room : room.toUpperCase(),
        users
    })

    document.querySelector('#sidebar').innerHTML = html
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
        // alert(error)
        swal("Denied!", `${error}`, "error")
        setTimeout(() => {
            location.href= '/'
        }, 2000)
    }
})