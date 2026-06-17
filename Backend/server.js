const express = require("express");
const cors = require("cors");
const pool = require("./db");
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.get("/", async (req, res) => {
  const result = await pool.query("SELECT NOW()");
  res.json(result.rows[0]);
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});