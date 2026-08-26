const express = require("express");

const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");

const {
  getMyNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead
} = require("../controllers/notificationController");


// Get logged-in user's notifications
router.get(
  "/",
  verifyToken,
  getMyNotifications
);


// Mark one notification as read
router.put(
  "/:id/read",
  verifyToken,
  markNotificationAsRead
);


// Mark all notifications as read
router.put(
  "/read-all",
  verifyToken,
  markAllNotificationsAsRead
);


module.exports = router;