const express = require("express");
const verifyToken = require("../middleware/authMiddleware");
const authorizeRole = require("../middleware/roleMiddleware");
const router = express.Router();
router.get("/admin",verifyToken,authorizeRole("admin"),(req,res)=>{
    res.json({
        message: "Admin Dashboard",
        user: req.user
    });
});
router.get("/cook",verifyToken,authorizeRole("cook"),(req,res)=>{
    res.json({message: "Cook Dashboard",
        user: req.user
   });
});
router.get("/customer",verifyToken,authorizeRole("customer"),(req,res)=>{
    res.json({
        message:"Customer Dashboard",
        user: req.user
    });
});
module.exports = router;