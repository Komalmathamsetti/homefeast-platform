const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");
const {
  getDashboard,getProfile,updateProfile,createComplaint
} = require("../controllers/customerController");
router.get(
  "/dashboard",
  verifyToken,
  getDashboard
);
router.get("/profile",verifyToken,getProfile);
router.put("/profile",verifyToken,updateProfile);
router.post("/complaints",verifyToken,createComplaint);
module.exports = router;