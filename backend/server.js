const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { Pool, Query } = require("pg");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
});

app.get("/", (req, res) => {
  res.send("TourISLA API is running!");
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});

app.get("/users", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users");
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/signup", async (req, res) => {
  const {
    first_name,
    last_name,
    email,
    password,
    phone_number,
    role,
    traveller_type,
    nationality,
    deleted_at,
    last_login_at,
    last_login_ip,
    created_at,
  } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO users (first_name, last_name, email, password, phone_number, role, traveller_type, nationality, deleted_at, last_login_at, last_login_ip, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW()) RETURNING *",
      [
        first_name,
        last_name,
        email,
        password,
        phone_number,
        role,
        traveller_type,
        nationality,
        deleted_at,
        last_login_at,
        last_login_ip,
      ]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error adding user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
