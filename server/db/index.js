const { Pool } = require('pg');

const db = new Pool({
  user: 'lucky8',
  database: 'qa',
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  dialect: 'postgres',
  port: 5432,
});

db.connect()
  .then(() => console.log('Database is connected!'))
  .catch((e) => console.error(e));

module.exports = db;
