const express = require("express");
const cors = require("cors");
const pool = require("./db");
const app = express();
const authRoutes = require("./routes/authRoutes");

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.get("/", async (req, res) => {
  res.send("Homefeast API is running");
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});