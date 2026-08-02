const express = require("express");
const router = express.Router();
const { getCookDashboard } = require("../controllers/dashboardController");
const verifyToken = require("../middleware/authMiddleware");
const authorizeRole = require("../middleware/roleMiddleware");
router.get("/",verifyToken,authorizeRole("cook"),getCookDashboard);
module.exports = router;