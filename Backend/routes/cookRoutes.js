const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const authorizeRole = require('../middleware/roleMiddleware');
const {
    createcookProfile,
    getCookProfile,
    updateCookProfile,
    getMyComplaints 
}  = require('../controllers/cookController');
router.post("/",verifyToken,authorizeRole("cook"),createcookProfile);
router.get("/profile",verifyToken,authorizeRole("cook"),getCookProfile);
router.put("/profile",verifyToken,authorizeRole("cook"),updateCookProfile);
router.get("/complaints",verifyToken,authorizeRole("cook"),getMyComplaints);
module.exports = router;
