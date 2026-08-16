const express = require('express');
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");
const authorizeRole = require("../middleware/roleMiddleware");
const { getDashboardStats,getPendingCooks,approveCook,rejectCook,getAllUsers,getAllOrders,getAllSubscriptions,getAllCuisines,getAllCategories,updateCategory,updateCuisine,deleteCategory,deleteCuisine } = require("../controllers/adminController");
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

module.exports = router;