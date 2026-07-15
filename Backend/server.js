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
const orderRoutes = require("./routes/orderRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const adminRoutes = require("./routes/adminRoutes");
const customerRoutes = require("./routes/customerRoutes");
// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashBoardRoutes);
app.use("/api/customer",customerRoutes);
app.use("/api/cooks",cookRoutes);
app.use("/api/menus",menuRoutes);
app.use("/api/search",searchRoutes);
app.use("/api/subscriptions",subscriptions);
app.use("/api/orders",orderRoutes);
app.use("/api/reviews",reviewRoutes);
app.use("/api/admin",adminRoutes);
app.get("/", async (req, res) => {
  res.send("Homefeast API is running");
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});