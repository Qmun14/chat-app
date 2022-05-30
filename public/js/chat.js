const socket = io()

socket.on('countUpdated', (hasilCount) => {
    console.log('The count has been updated!', hasilCount)
})

document.querySelector('#increment').addEventListener('click', () => {
    console.log('Clicked')
    socket.emit('increment')
})