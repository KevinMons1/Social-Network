const mysql = require("mysql2")
require('dotenv').config()

// Create connection
const db = mysql.createPool({
    connectionLimit: process.env.CONNECTIONLIMIT,
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
})

// Connect
db.getConnection((err) => {
    if (err) {
        throw err
    }
    console.log("Mysql connected...")
})

module.exports = db