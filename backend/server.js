require("dotenv").config();

const express = require("express");

const db = require("./db/index.js");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT || 3005;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.get("/api/v1/users", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM users");
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/v1/users", async (req, res) => {
  try {
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
    const result = await db.query(
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
    res.status(201).json({
      status: "success",
      data: {
        user: result.rows,
      },
    });
  } catch (error) {
    console.error("Error adding user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
