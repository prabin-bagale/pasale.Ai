const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ Database connection failed:', err.message);
    return;
  }
  client.query('SELECT NOW()', (err, result) => {
    release();
    if (err) {
      console.error('❌ Database query failed:', err.message);
    } else {
      console.log('✅ Database connected at:', result.rows[0].now);
    }
  });
});

async function query(text, params) {
  const result = await pool.query(text, params);
  return result;
}

module.exports = { query };