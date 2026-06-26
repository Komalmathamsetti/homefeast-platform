const express = require('express');
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");
const authorizeRole = require("../middleware/roleMiddleware");
const { getAllUsers,getAllCooks,approveCook,rejectCook,getAllOrders,getAllSubscriptions,dashboardStats } = require("../controllers/adminController");
router.get(
    "/users",
    verifyToken,
    authorizeRole("admin"),
    getAllUsers
);
router.get(
    "/cooks",
    verifyToken,
    authorizeRole("admin"),
    getAllCooks
);
router.put(
    "/approve/:id",
    verifyToken,
    authorizeRole("admin"),
    approveCook
);
router.put(
    "/reject/:id",
    verifyToken,
    authorizeRole("admin"),
    rejectCook
);
router.get(
    "/orders",
    verifyToken,
    authorizeRole("admin"),
    getAllOrders
);
router.get(
    "/subscriptions",
    verifyToken,
    authorizeRole("admin"),
    getAllSubscriptions
);
router.get(
    "/dashboard",
    verifyToken,
    authorizeRole("admin"),
    dashboardStats
);
module.exports = router;