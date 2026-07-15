const pool = require("../db");

const getDashboard = async (req, res) => {
  try {
    const userId = req.user.userId;
    const totalOrders = await pool.query(
      `SELECT COUNT(*) FROM orders
       WHERE user_id = $1`,
      [userId]
    );
    const pendingOrders = await pool.query(
      `SELECT COUNT(*) FROM orders
       WHERE user_id = $1
       AND order_status='Pending'`,
      [userId]
    );
    const completedOrders = await pool.query(
      `SELECT COUNT(*) FROM orders
       WHERE user_id = $1
       AND order_status='Delivered'`,
      [userId]
    );
    const activeSubscriptions = await pool.query(
      `SELECT COUNT(*) FROM subscriptions
       WHERE user_id=$1
       AND status='Active'`,
      [userId]
    );
    const recentOrders = await pool.query(
      `SELECT
        orders.id,
        menus.dish_name,
        users.name AS cook_name,
        orders.order_status,
        orders.order_date
      FROM orders
      JOIN menus
      ON orders.menu_id = menus.id
      JOIN cooks
      ON orders.cook_id = cooks.id
      JOIN users
      ON cooks.user_id = users.id
      WHERE orders.user_id=$1
      ORDER BY orders.order_date DESC
      LIMIT 5`,
      [userId]
    );
    res.status(200).json({
      stats: {
        totalOrders: Number(totalOrders.rows[0].count),
        pendingOrders: Number(pendingOrders.rows[0].count),
        completedOrders: Number(completedOrders.rows[0].count),
        activeSubscriptions: Number(activeSubscriptions.rows[0].count),
      },
      recentOrders: recentOrders.rows,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
};
module.exports = {
  getDashboard,
};