const mysql = require('mysql2')
const accountsDb = mysql.createPool({
    host: 'localhost',     // Your MySQL host
    user: 'root',          // Your MySQL username
    password: 'SocietyMAACDK@24',  // Your MySQL password
    database: 'accounts' // Your MySQL database
  })

  const membersDb = mysql.createPool({
    host: 'localhost',     // Your MySQL host
    user: 'root',          // Your MySQL username
    password: 'SocietyMAACDK@24',  // Your MySQL password
    database: 'member_features' // Your MySQL database
  })

  const adminsDb = mysql.createPool({
    host: 'localhost',     // Your MySQL host
    user: 'root',          // Your MySQL username
    password: 'SocietyMAACDK@24',  // Your MySQL password
    database: 'admin_features' 
  })

  module.exports = {accountsDb,membersDb,adminsDb};