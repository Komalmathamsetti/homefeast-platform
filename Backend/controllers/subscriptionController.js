const pool = require("../db");
const { createNotification } = require("../services/notificationServices");
const createSubscription = async (req, res) => {
  try {
    const userId = req.user.userId;

    const { cook_id, plan_type } = req.body;

    // Check cook exists
    const cook = await pool.query(
      `
            SELECT *
            FROM cooks
            WHERE id = $1
            `,
      [cook_id],
    );

    if (cook.rows.length === 0) {
      return res.status(404).json({
        message: "Cook not found",
      });
    }
    const existing = await pool.query(
      `
            SELECT *
            FROM subscriptions

            WHERE user_id = $1
            AND cook_id = $2

            AND LOWER(status)
            IN ('pending', 'active')
            `,
      [userId, cook_id],
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({
        message: "You already have an active subscription for this cook.",
      });
    }

    // Create subscription
    const subscription = await pool.query(
      `
            INSERT INTO subscriptions
            (
                user_id,
                cook_id,
                plan_type,
                start_date,
                status
            )
            VALUES
            (
                $1,
                $2,
                $3,
                CURRENT_DATE,
                'Pending'
            )

            RETURNING *
            `,
      [userId, cook_id, plan_type],
    );
    const createdSubscription = subscription.rows[0];
    const cookUserId = cook.rows[0].user_id;
    await createNotification({
      userId: cookUserId,

      title: "New Subscription Request",

      message: `You received a new ${plan_type} subscription request.`,

      type: "SUBSCRIPTION",

      relatedId: createdSubscription.id,
    });

    res.status(201).json({
      message: "Subscription created",

      subscription: createdSubscription,
    });
  } catch (error) {
    console.log("Create Subscription Error:", error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};
const getMySubscriptions = async (req, res) => {
  try {
    const userId = req.user.userId;
    const subscriptions = await pool.query(
      `SELECT
            subscriptions.*,
            users.name,
            cooks.service_area,
            cooks.delivery_timings
            FROM subscriptions
            JOIN cooks
            ON subscriptions.cook_id = cooks.id
            JOIN users
            ON cooks.user_id = users.id
            WHERE subscriptions.user_id = $1;`,
      [userId],
    );
    res.status(200).json(subscriptions.rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
};
const cancelSubscription = async (req, res) => {
  try {
    const subscriptionId = req.params.id;
    const userId = req.user.userId;
    const subscription = await pool.query(
      `SELECT * FROM 
            subscriptions WHERE id = $1`,
      [subscriptionId],
    );
    if (subscription.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Subscription not found",
      });
    }
    if (subscription.rows[0].user_id !== userId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }
    const cancelled = await pool.query(
      `UPDATE subscriptions
            SET status = 'Cancelled'
            WHERE id = $1
            RETURNING *`,
      [subscriptionId],
    );
    res.status(200).json({
      message: "Subscription cancelled",
      subscription: cancelled.rows[0],
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};
const getCookSubscribers = async (req, res) => {
  try {
    const userId = req.user.userId;
    const cook = await pool.query(
      `SELECT * FROM cooks
        WHERE user_id = $1`,
      [userId],
    );
    if (cook.rows.length === 0) {
      return res.status(404).json({ message: "Cook not found" });
    }
    const subscribers = await pool.query(
      `SELECT
        subscriptions.*,
        users.name,
        users.email
     FROM subscriptions
     JOIN users
     ON subscriptions.user_id = users.id
     WHERE subscriptions.cook_id = $1`,
      [cook.rows[0].id],
    );
    res.status(200).json(subscribers.rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};
const updateSubscription = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;
    const { status } = req.body;
    if (!["Active", "Rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }
    const cook = await pool.query(
      `
            SELECT *
            FROM cooks
            WHERE user_id = $1
            `,
      [userId],
    );
    if (cook.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Cook not found",
      });
    }
    const cookId = cook.rows[0].id;
    const subscription = await pool.query(
      `
            SELECT *
            FROM subscriptions
            WHERE id = $1
            AND cook_id = $2
            `,
      [id, cookId],
    );
    if (subscription.rows.length === 0) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }
    const existingSubscription = subscription.rows[0];
    const updated = await pool.query(
      `
            UPDATE subscriptions
            SET status = $1
            WHERE id = $2
            RETURNING *
            `,
      [status, id],
    );
    const updatedSubscription = updated.rows[0];
    let title = "";
    let message = "";
    if (status === "Active") {
      title = "Subscription Accepted";
      message = "Your subscription request has been accepted by the cook.";
    }
    if (status === "Rejected") {
      title = "Subscription Rejected";
      message = "Your subscription request has been rejected by the cook.";
    }

    await createNotification({
      userId: existingSubscription.user_id,

      title,

      message,

      type: "SUBSCRIPTION",

      relatedId: updatedSubscription.id,
    });

    res.status(200).json({
      success: true,

      message: `Subscription ${status.toLowerCase()} successfully`,

      subscription: updatedSubscription,
    });
  } catch (error) {
    console.log("Update Subscription Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
module.exports = {
  createSubscription,
  getMySubscriptions,
  cancelSubscription,
  getCookSubscribers,
  updateSubscription,
};
