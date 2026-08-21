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
const getProfile = async(req,res)=>{
  try{
    const  userId = req.user.userId;
    const result = await pool.query(
      `SELECT u.id,
      u.name,
      u.email,
      u.phone,
      cp.address
      FROM users u
      LEFT JOIN customer_profiles cp
      ON u.id = cp.user_id
      WHERE u.id = $1`,[userId]
    );
    if(result.rows.length === 0){
      return res.status(404).json({
        message:"User Not found"
      });
    }
    res.status(200).json(result.rows[0]);
  }catch(error){
    console.log(error);
    res.status(500).json({message:"Server Error"});
  }
};
const updateProfile = async (req, res) => {
    try {
        const userId = req.user.userId;
        const {
            name,
            phone,
            address
        } = req.body;
        // Update users table
        await pool.query(
            `UPDATE users
            SET
                name=$1,
                phone=$2
            WHERE id=$3`,
            [name,phone,userId]
        );
        // Update customer_profiles table
        await pool.query(
            `UPDATE customer_profiles
            SET address=$1
            WHERE user_id=$2`,
            [address,userId]
        );
        const updatedUser = await pool.query(
            `SELECT
                u.id,
                u.name,
                u.email,
                u.phone,
                cp.address
            FROM users u
            LEFT JOIN customer_profiles cp
            ON u.id=cp.user_id
            WHERE u.id=$1
            `,
            [userId]
        );
        res.status(200).json({
            message: "Profile Updated Successfully",
            user: updatedUser.rows[0]
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server Error"
        });
    }
};
const createComplaint = async (req, res) => {
  try {
    const userId = req.user.userId;

    const {
      order_id,
      description
    } = req.body;

    if (!order_id || !description || !description.trim()) {
      return res.status(400).json({
        success: false,
        message: "Order ID and complaint description are required"
      });
    }

    // Check that this order belongs to the customer
    const order = await pool.query(
      `
      SELECT id
      FROM orders
      WHERE id = $1
      AND user_id = $2
      `,
      [order_id, userId]
    );

    if (order.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    // Prevent duplicate active complaints
    const existingComplaint = await pool.query(
      `
      SELECT id
      FROM complaints
      WHERE order_id = $1
      AND user_id = $2
      AND status != 'Resolved'
      `,
      [order_id, userId]
    );

    if (existingComplaint.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: "You already have an active complaint for this order"
      });
    }

    // IMPORTANT:
    // cook_id is intentionally NOT inserted.
    // Admin will assign the cook later if required.

    const complaint = await pool.query(
      `
      INSERT INTO complaints
      (
        user_id,
        order_id,
        description,
        status
      )
      VALUES
      (
        $1,
        $2,
        $3,
        'Open'
      )
      RETURNING *
      `,
      [
        userId,
        order_id,
        description.trim()
      ]
    );

    res.status(201).json({
      success: true,
      message: "Complaint submitted successfully",
      complaint: complaint.rows[0]
    });

  } catch (error) {
    console.error("Create Complaint Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};


/* =====================================================
   Get Customer's Complaints
===================================================== */

const getMyComplaints = async (req, res) => {
  try {
    const userId = req.user.userId;

    const complaints = await pool.query(
      `
      SELECT
        complaints.id,
        complaints.order_id,
        complaints.description,
        complaints.status,
        complaints.created_at,

        cooks.id AS cook_id,
        cook_user.name AS cook_name

      FROM complaints

      LEFT JOIN cooks
        ON complaints.cook_id = cooks.id

      LEFT JOIN users cook_user
        ON cooks.user_id = cook_user.id

      WHERE complaints.user_id = $1

      ORDER BY complaints.created_at DESC
      `,
      [userId]
    );

    res.status(200).json({
      success: true,
      complaints: complaints.rows,
    });

  } catch (error) {
    console.log(
      "Get My Complaints Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


module.exports = {
  getDashboard,getProfile,updateProfile,createComplaint,getMyComplaints
};