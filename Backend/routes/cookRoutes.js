const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const authorizeRole = require('../middleware/roleMiddleware');
const verifyCookApproved = require('../middleware/cookApprovalMiddleware');
const {
    createcookProfile,
    getCookProfile,
    updateCookProfile,
    getMyComplaints,
    respondToComplaint,
    getCookApprovalStatus
}  = require('../controllers/cookController');
router.post("/",verifyToken,authorizeRole("cook"),createcookProfile);
router.get("/approval-status",verifyToken,authorizeRole("cook"),getCookApprovalStatus);
router.get("/profile",verifyToken,authorizeRole("cook"),verifyCookApproved,getCookProfile);
router.put("/profile",verifyToken,authorizeRole("cook"),verifyCookApproved,updateCookProfile);
router.get("/complaints",verifyToken,authorizeRole("cook"),verifyCookApproved,getMyComplaints);
router.post("/complaints/:id/respond",verifyToken,authorizeRole("cook"),verifyCookApproved,respondToComplaint);
module.exports = router;
