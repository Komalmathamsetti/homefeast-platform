const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");
const {
  getDashboard,
} = require("../controllers/customerController");
router.get(
  "/dashboard",
  verifyToken,
  getDashboard
);
module.exports = router;