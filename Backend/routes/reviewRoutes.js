const express = require('express');
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");
const authorizeRole = require("../middleware/roleMiddleware");
const { addReview, getAllReviews, getAverageRating } = require("../controllers/reviewController");
router.post("/",verifyToken,authorizeRole("customer"),addReview);
router.get("/:id",getAllReviews);
router.get("/average/:id",getAverageRating);
module.exports = router;