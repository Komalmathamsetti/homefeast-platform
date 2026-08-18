const express = require('express');
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");
const authorizeRole = require("../middleware/roleMiddleware");
const { getDashboardStats,getPendingCooks,approveCook,rejectCook,getAllUsers,getAllOrders,getAllSubscriptions,getAllCuisines,getAllCategories,updateCategory,updateCuisine,getAllComplaints,getComplaintById,updateComplaintStatus } = require("../controllers/adminController");
router.get(
  "/dashboard",
  verifyToken,
  authorizeRole("admin"),
  getDashboardStats
);
router.get(
  "/users",
  verifyToken,
  authorizeRole("admin"),
  getAllUsers
);
router.get(
  "/pending-cooks",
  verifyToken,
  authorizeRole("admin"),
  getPendingCooks
);
router.put(
  "/approve-cook/:id",
  verifyToken,
  authorizeRole("admin"),
  approveCook
);
router.put(
  "/reject-cook/:id",
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
router.get("/cuisines",verifyToken,authorizeRole("admin"),getAllCuisines);
router.put("/cuisines/:name",verifyToken,authorizeRole("admin"),updateCuisine);
router.get("/categories",verifyToken,authorizeRole("admin"),getAllCategories);
router.put("/categories/:name",verifyToken,authorizeRole("admin"),updateCategory);
router.get("/complaints",verifyToken,authorizeRole("admin"),getAllComplaints);
router.get("/complaints/:id",verifyToken,authorizeRole("admin"),getComplaintById);
router.put("/complaint/:id/status",verifyToken,authorizeRole("admin"),updateComplaintStatus);
module.exports = router;