require("dotenv").config();

const { Pool } = require("pg");

const isProd = process.env.NODE_ENV === "production";

// Support both DB_* and PG* env vars for compatibility
const pool = new Pool({
  user: process.env.DB_USER || process.env.PGUSER,
  host: process.env.DB_HOST || process.env.PGHOST,
  database: process.env.DB_NAME || process.env.PGDATABASE,
  password: process.env.DB_PASSWORD || process.env.PGPASSWORD,
  port: process.env.DB_PORT || process.env.PGPORT,
  ssl: {
    require: true,
    rejectUnauthorized: false,
  },
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
};
