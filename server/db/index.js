require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  user: 'test_user',
  database: 'qa',
  password: 'testpassword',
  host: '13.57.5.38',
  port: 5432,
});

pool
  .connect()
  .then(() => console.log('Database is connected!'))
  .catch((err) => console.log('err', err));

module.exports = pool;
