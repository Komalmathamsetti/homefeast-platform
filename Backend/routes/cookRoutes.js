const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const authorizeRole = require('../middleware/roleMiddleware');
const {
    createcookProfile,
    getCookProfile,
    updateCookProfile   
}  = require('../controllers/cookController');

router.post("/",verifyToken,authorizeRole("cook"),createcookProfile);
router.get("/:id",getCookProfile);
router.put("/",verifyToken,authorizeRole("cook"),updateCookProfile);
module.exports = router;
