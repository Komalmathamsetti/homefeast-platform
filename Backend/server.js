const express = require("express");
const cors = require("cors");
const pool = require("./db");
const app = express();
const authRoutes = require("./routes/authRoutes");
const dashBoardRoutes = require("./routes/dashBoardRoutes");
const cookRoutes = require("./routes/cookRoutes");
const menuRoutes = require("./routes/menuRoutes");
const searchRoutes = require("./routes/searchRoutes");
const subscriptions = require("./routes/subscriptionRoutes");
// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashBoardRoutes);
app.use("/api/cooks",cookRoutes);
app.use("/api/menus",menuRoutes);
app.use("/api/search",searchRoutes);
app.use("/api/subscriptions",subscriptions);
app.get("/", async (req, res) => {
  res.send("Homefeast API is running");
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});