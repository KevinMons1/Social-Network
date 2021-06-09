const mysql = require("mysql2")
require('dotenv').config()

// Create connection
const db = mysql.createConnection({
    host: process.env.HOST,
    port: process.env.PORT,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    insecureAuth: process.env.INSECUREAUTH
})

// Connect
db.connect((err) => {
    if (err) {
        throw err
    }
    console.log("Mysql connected...")
})

module.exports = db