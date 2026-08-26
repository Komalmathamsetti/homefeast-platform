const pool = require("../db");


// =====================================================
// CREATE NOTIFICATION
// =====================================================

const createNotification = async ({
  userId,
  title,
  message,
  type = null,
  relatedId = null
}) => {
  try {

    const notification = await pool.query(
      `
      INSERT INTO notifications
      (
        user_id,
        title,
        message,
        type,
        related_id
      )
      VALUES
      ($1, $2, $3, $4, $5)
      RETURNING *
      `,
      [
        userId,
        title,
        message,
        type,
        relatedId
      ]
    );

    return notification.rows[0];

  } catch (error) {

    console.error(
      "Create Notification Error:",
      error
    );

    throw error;
  }
};


// =====================================================
// GET MY NOTIFICATIONS
// =====================================================

const getMyNotifications = async (req, res) => {

  try {

    const userId = req.user.userId;

    const result = await pool.query(
      `
      SELECT
        id,
        title,
        message,
        type,
        related_id,
        is_read,
        created_at

      FROM notifications

      WHERE user_id = $1

      ORDER BY created_at DESC
      `,
      [userId]
    );

    const unreadResult = await pool.query(
      `
      SELECT COUNT(*) AS unread_count

      FROM notifications

      WHERE user_id = $1
      AND is_read = FALSE
      `,
      [userId]
    );

    res.status(200).json({
      success: true,

      notifications: result.rows,

      unreadCount: Number(
        unreadResult.rows[0].unread_count
      )
    });

  } catch (error) {

    console.error(
      "Get Notifications Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};


// =====================================================
// MARK ONE NOTIFICATION AS READ
// =====================================================

const markNotificationAsRead = async (req, res) => {

  try {

    const userId = req.user.userId;

    const notificationId = req.params.id;

    const result = await pool.query(
      `
      UPDATE notifications

      SET is_read = TRUE

      WHERE id = $1
      AND user_id = $2

      RETURNING *
      `,
      [
        notificationId,
        userId
      ]
    );

    if (result.rows.length === 0) {

      return res.status(404).json({
        success: false,
        message: "Notification not found"
      });

    }

    res.status(200).json({
      success: true,
      message: "Notification marked as read",
      notification: result.rows[0]
    });

  } catch (error) {

    console.error(
      "Mark Notification Read Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};


// =====================================================
// MARK ALL NOTIFICATIONS AS READ
// =====================================================

const markAllNotificationsAsRead = async (req, res) => {

  try {

    const userId = req.user.userId;

    await pool.query(
      `
      UPDATE notifications

      SET is_read = TRUE

      WHERE user_id = $1
      AND is_read = FALSE
      `,
      [userId]
    );

    res.status(200).json({
      success: true,
      message: "All notifications marked as read"
    });

  } catch (error) {

    console.error(
      "Mark All Notifications Read Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};


module.exports = {
  createNotification,
  getMyNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead
};