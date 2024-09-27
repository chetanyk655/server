// config/config.js

const path = require('path');
const dotenv = require('dotenv').config();  // Load .env file


// Determine the current environment (default to 'development')
const env = process.env.NODE_ENV || 'development';



const config = {
  app: {
    port: process.env.PORT || 2000,
    env: env,
    baseUrl: process.env.BASE_URL || 'http://localhost:2000',
  },
  db: {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'mydb',
    port: process.env.DB_PORT || 3306,
    pool: {
      max: 20,          // Maximum number of connections in pool
      min: 0,           // Minimum number of connections in pool
      acquire: 30000,   // Maximum time (ms) to try getting a connection before throwing error
      idle: 10000,      // Maximum time (ms) a connection can be idle before being released
    },
  },
};

module.exports = config;
