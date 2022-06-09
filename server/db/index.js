const { Client } = require('pg');

const client = new Client({
  user: process.env.DB_USERNAME,
  database: process.env.DB_DATABASENAME,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  dialect: 'postgres',
  port: process.env.DB_PORT,
});

client
  .connect()
  .then(() => console.log(`Database is connected! port:${port}`))
  .catch((e) => console.error(e));

module.exports = db;
