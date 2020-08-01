const users=[]

const addUser= ({id,username,room}) => {
//cleaning data
    username=username.trim().toLowerCase()
    room=room.trim().toLowerCase()
//validating users and room
    if(!username || !room){
        return{
            error:'Username and Room are required'
        }
    }
//checking for existing username
    const existingUser=users.find((user)=>{
        return user.room===room && user.username===username
    })
//denying existing entry
    if(existingUser){
        return{
            error:'Username is in use'
        }
    }
//store user
const user={id, username, room}
users.push(user)
return {user}
}

const removeUser= (id)=>{
    const index= users.findIndex((user)=>{
    return user.id===id 
})
if(index!==-1){
    return users.splice(index,1)[0]
}
}

const getUser= (id)=>{
    return users.find((user)=> user.id===id)
}

const getUsersInRoom= (room)=>{
    room=room.trim().toLowerCase()
    return users.filter((user)=> user.room===room)
}

module.exports={
    addUser,
    getUser,
    getUsersInRoom,
    removeUser
}