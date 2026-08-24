const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");
const {
  getDashboard,getProfile,updateProfile,createComplaint,getMyComplaints,createReview,getCookReviews
} = require("../controllers/customerController");
router.get(
  "/dashboard",
  verifyToken,
  getDashboard
);
router.get("/profile",verifyToken,getProfile);
router.put("/profile",verifyToken,updateProfile);
router.post("/complaints",verifyToken,createComplaint);
router.get("/complaints",verifyToken,getMyComplaints);
router.post("/reviews",verifyToken,createReview);
router.get("/cook/:cookId/reviews",getCookReviews);
module.exports = router;