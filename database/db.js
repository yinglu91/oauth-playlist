const Pool = require('pg').Pool;
const keys = require('../config/keys');

const devConfig = keys.postgres.dbURL;

const prodConfig = process.env.DATABASE_URL; // heroku addons

const connectionString =
  process.env.NODE_ENV === 'production' ? prodConfig : devConfig;
console.log(connectionString);

const pool = new Pool({
  connectionString,
});

module.exports = pool;

// const Pool = require('pg').Pool;

// const pool = new Pool({
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   host: process.env.DB_HOST,
//   port: +process.env.DB_PORT, // + => convert string to number type
//   database: process.env.DB_DATABASE,
// });

// module.exports = pool;
