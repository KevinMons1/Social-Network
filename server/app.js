const express = require("express")
const app = express()
const http = require('http').Server(app)
const bodyParser = require("body-parser")
const cors = require("cors")
const path = require("path")
const io = require('socket.io')(http, {
    log: false,
    agent: false,
    transports : [ 'websocket' ],
    cors: {
      origin: '*',
    }
  })

// Routes
const authRoutes = require("./Routers/auth")
const userRoutes = require("./Routers/user")
const publicationsRoutes = require("./Routers/publications")
const chatRouter = require("./Routers/chat")
const notificationsRoutes = require("./Routers/notifications")

app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())
app.use('/Images', express.static(path.join(__dirname, 'Images'))) // Send folder Images on server
app.use('/Videos', express.static(path.join(__dirname, 'Videos'))) // Send folder Videos on server

// Path
app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes) 
app.use('/api/publications', publicationsRoutes)
app.use('/api/chat', chatRouter)
app.use('/api/notifications', notificationsRoutes)

let usersInChatRoom = []
let usersConnected = []


io.on('connection', (socket) => { 
    //----
    // Connection
    //----

    socket.on('userConnected', (user) => {    
        usersConnected[user] = socket.id
    })

    socket.on('sendMyConnection', (user) => {
        let friends = user.friends
        let userId = user.userId
        let socketFriendId
               
        //If a friends of user connected, the socketId is send
        friends.forEach(friendId => {
            socketFriendId = usersConnected[friendId]
            if (socketFriendId !== undefined) io.to(socketFriendId).emit('sendMyConnection', userId)
        })
    })

    //-----
    // Chat
    //-----

    socket.on('userConnectedOnChat', userId => {
        usersInChatRoom[userId] = socket.id   
        console.log("connexion: " + usersInChatRoom[userId])
    })

    // receive message and send message
    socket.on('sendMessage', data => {
        let { receiver } = data
        let socketId = usersInChatRoom[receiver]
        io.to(socketId).emit("newMessage", data)
    })

    //----
    // Notification
    //----

    socket.on("notification", data => {
        let socketId = usersConnected[data.receiver]
        io.to(socketId).emit("notification", data.sender)
    })

    socket.on("notificationChat", data => {
        let socketId = usersConnected[data.receiver]
        io.to(socketId).emit("notificationChat", data)
    })
})

// Start server
http.listen("3001", () => {
    console.log("Server started on port 3001")
})

exports.io = io

