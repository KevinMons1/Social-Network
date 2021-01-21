const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const cors = require("cors")
const db = require("./db")

// Routes
const authRoutes = require("./Routers/auth")

// app.use((req, res) => {
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
// });

app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())

// Path
app.use('/api/auth', authRoutes)

// Start server
app.listen("3001", () => {
    console.log("Server started on port 3001")
})

