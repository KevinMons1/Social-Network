const express = require("express")
const app = express()
const http = require('http').Server(app)
const bodyParser = require("body-parser")
const cors = require("cors")
const path = require("path")
const io = require('socket.io')(http, {
    cors: {
      origin: '*',
    }
  })

// Routes
const authRoutes = require("./Routers/auth")
const userRoutes = require("./Routers/user")
const publicationsRoutes = require("./Routers/publications")
const chatRouter = require("./Routers/chat")

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

let usersInRoom = []
io.on('connection', (socket) => {            
    // get user connect
    socket.on('userConnected', (userId) => {
        usersInRoom[userId] = socket.id
        io.emit('userConnected', userId)
    })

    // receive message and send message
    socket.on('sendMessage', data => {
        let { receiver } = data
        let socketId = usersInRoom[receiver]

        io.to(socketId).emit("newMessage", data)

    })

    socket.on('disconnect', () => {
        // console.log('user disconnected')
    })
})

// Start server
http.listen("3001", () => {
    console.log("Server started on port 3001")
})

exports.io = io

