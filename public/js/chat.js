
const socket=io()
//elements
const $messageForm=document.querySelector('#message-form')
const $messageFormInput=document.querySelector('input')
const $messageFormButton=document.querySelector('button')
const $sendLocationButton=document.querySelector('#send-location')
const $messages=document.querySelector('#messages')

//template
const messageTemplate=document.querySelector('#message-template').innerHTML
const locationMessageTemplate=document.querySelector('#location-message-template').innerHTML
const sidebarTemplate=document.querySelector('#sidebar-template').innerHTML

//query
const {username,room}=Qs.parse(location.search,{ignoreQueryPrefix: true})

//autoscroll
const autoscroll= ()=>{
    //get new message
    const $newMessage= $messages.lastElementChild
    //get height of new message
    const newMessageStyles=getComputedStyle($newMessage)
    const newMessageMargin=parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin
    //visible height
    const visibleHeight= $messages.offsetHeight
    //container height
    const containerHeight= $messages.scrollHeight
    //how far have we scrolled
    const scrollOffset=$messages.scrollTop+visibleHeight
    if(containerHeight-newMessageHeight<=scrollOffset){
        $messages.scrollTop=$messages.scrollHeight
    } 
}

socket.on('message',(message)=>{
    console.log(message)
    const html=Mustache.render(messageTemplate,{
        username:message.username,
        message:message.text,
        createdAt: moment(message.createdAt).format('h:mm A')
    })
    $messages.insertAdjacentHTML('beforeend',html)
    autoscroll()
})

socket.on('locationMessage',(message)=>{
    console.log(message)
    const html=Mustache.render(locationMessageTemplate,{
        username:message.username,
        url:message.url,
        createdAt: moment(message.createdAt).format('h:mm A')
    })
    $messages.insertAdjacentHTML('beforeend',html)
    autoscroll()
})

socket.on('roomData',({room, users})=>{
    const html=Mustache.render(sidebarTemplate,{
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML= html
})

$messageForm.addEventListener('submit', (e)=>{
    e.preventDefault()
    const message=e.target.elements.message.value
    $messageFormButton.setAttribute('disabled','disabled')
    socket.emit('sendMessage',message,(error)=>{
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value=''
        $messageFormInput.focus()
        if(error){
            return console.log(error)
        }
        console.log('Message Delivered')
    })
}) 
$sendLocationButton.addEventListener('click',()=>{
    if(!navigator.geolocation){
        return console.log('Geolocation not supported')
    }
    $sendLocationButton.setAttribute('disabled','disabled')
    navigator.geolocation.getCurrentPosition((position)=>{
        socket.emit('sendLocation',{
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        },()=>{
            $sendLocationButton.removeAttribute('disabled')
            console.log('Location Delivered')
        })
    })
})

socket.emit('join',{username, room},(error)=>{
    if(error){
        alert(error)
        location.href='/'
    }
})