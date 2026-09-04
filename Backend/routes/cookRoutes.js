const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const authorizeRole = require('../middleware/roleMiddleware');
const verifyCookApproved = require('../middleware/cookApprovalMiddleware');
const { uploadCookImage }  = require("../middleware/uploadMiddleware");
const {
    createcookProfile,
    getCookProfile,
    updateCookProfile,
    getMyComplaints,
    respondToComplaint,
    getCookApprovalStatus
}  = require('../controllers/cookController');
router.post("/",verifyToken,authorizeRole("cook"),uploadCookImage.single("image"),createcookProfile);
router.get("/approval-status",verifyToken,authorizeRole("cook"),getCookApprovalStatus);
router.get("/profile",verifyToken,authorizeRole("cook"),verifyCookApproved,getCookProfile);
router.put("/profile",verifyToken,authorizeRole("cook"),verifyCookApproved,uploadCookImage.single("image"),updateCookProfile);
router.get("/complaints",verifyToken,authorizeRole("cook"),verifyCookApproved,getMyComplaints);
router.post("/complaints/:id/respond",verifyToken,authorizeRole("cook"),verifyCookApproved,respondToComplaint);
module.exports = router;
