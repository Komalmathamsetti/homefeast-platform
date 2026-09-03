const express = require("express");
const router = express.Router();
const { getCookDashboard } = require("../controllers/dashboardController");
const verifyToken = require("../middleware/authMiddleware");
const authorizeRole = require("../middleware/roleMiddleware");
const verifyCookApproved = require("../middleware/cookApprovalMiddleware");
router.get("/",verifyToken,authorizeRole("cook"),verifyCookApproved,getCookDashboard);
module.exports = router;