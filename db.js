const mysql = require('mysql2')
const pool = mysql.createPool({
    host: 'localhost',     // Your MySQL host
    user: 'root',          // Your MySQL username
    password: 'SocietyMAACDK@24',  // Your MySQL password
    database: 'accounts' // Your MySQL database
  })

  module.exports = pool;