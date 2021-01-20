const mysql = require("mysql")

// Create connection
const db = mysql.createConnection({
    host: "localhost",
    port: "3308",
    user: "root",
    password: "root",
    database: "social_network",
    insecureAuth : true
})

// Connect
db.connect((err) => {
    if (err) {
        throw err
    }
    console.log("Mysql connected...")
})

module.exports = db