const mysql = require('mysql2')
const config = require('./config')

const accountsDb = mysql.createPool({
    host: config.db.host,     // Your MySQL host
    user: config.db.user,          // Your MySQL username
    password: config.db.password,  // Your MySQL password
    database: 'accounts' // Your MySQL database
  })

  const membersDb = mysql.createPool({
    host: config.db.host,     // Your MySQL host
    user: config.db.user,          // Your MySQL username
    password: config.db.password,  // Your MySQL password
    database: 'member_features' // Your MySQL database
  })

  const adminsDb = mysql.createPool({
    host: config.db.host,     // Your MySQL host
    user: config.db.user,          // Your MySQL username
    password: config.db.password,  // Your MySQL password
    database: 'admin_features' 
  })

  module.exports = {accountsDb,membersDb,adminsDb};