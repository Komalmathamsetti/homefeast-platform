const pool = require("../db");
const getDashboardStats = async(req,res)=>{
  try{
    const totalUsers = await pool.query(
        `SELECT COUNT(*) AS count FROM users`
    );
    const totalCustomers = await pool.query(
        `SELECT COUNT(*) AS count FROM users
        WHERE role='customer'`
    );
    const totalCooks = await pool.query(
        `SELECT COUNT(*) AS count
        FROM cooks`
    );
    const pendingCooks = await pool.query(
        `SELECT COUNT(*) AS count
        FROM cooks
        WHERE approved = false`
    );
    const ordersToday = await pool.query(
        `SELECT COUNT(*) AS count
        FROM orders
        WHERE DATE(order_date) = CURRENT_DATE`
    );
    const revenueToday = await pool.query(
        `SELECT COALESCE(SUM(total_price),0) AS total
        FROM orders
        WHERE order_status = 'Delivered'
        AND DATE(delivered_at) = CURRENT_DATE`
    );
    const activeSubscriptions = await pool.query(`
      SELECT COUNT(*) AS count
      FROM subscriptions
      WHERE status = 'Active'
    `);

    res.status(200).json({
      success: true,
      summary: {
        totalUsers: Number(totalUsers.rows[0].count),
        totalCustomers: Number(totalCustomers.rows[0].count),
        totalCooks: Number(totalCooks.rows[0].count),
        pendingCooks: Number(pendingCooks.rows[0].count),
        ordersToday: Number(ordersToday.rows[0].count),
        revenueToday: Number(revenueToday.rows[0].total),
        activeSubscriptions: Number(activeSubscriptions.rows[0].count)
      }
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};
const getPendingCooks = async (req, res) => {
  try {

    const cooks = await pool.query(`
      SELECT
        cooks.id,
        users.name,
        users.email,
        users.phone,
        cooks.service_area,
        cooks.delivery_timings,
        cooks.bio,
        cooks.rating,
        cooks.approved
      FROM cooks
      JOIN users
      ON cooks.user_id = users.id
      WHERE cooks.approved = false
      ORDER BY cooks.id DESC
    `);

    res.status(200).json({success:true,cooks:cooks.rows});

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server Error"
    });
  }
};

/* ===========================================
   Approve Cook
=========================================== */
const approveCook = async (req, res) => {
  try {
    const { id } = req.params;

    const cook = await pool.query(
      `SELECT *
       FROM cooks
       WHERE id = $1`,
      [id]
    );

    if (cook.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Cook not found"
      });
    }
    if (cook.rows[0].approved === true) {
      return res.status(400).json({
        success: false,
        message: "Cook is already approved"
      });
    }
    const updated = await pool.query(
      `UPDATE cooks
       SET approved = true
       WHERE id = $1
       RETURNING *`,
      [id]
    );
    res.status(200).json({
      success: true,
      message: "Cook approved successfully",
      cook: updated.rows[0]
    });

  } catch (error) {
    console.log("Approve Cook Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};

/* ===========================================
   Reject Cook
=========================================== */
const rejectCook = async (req, res) => {
  try {
    const { id } = req.params;
    const cook = await pool.query(
      `SELECT *
       FROM cooks
       WHERE id = $1`,
      [id]
    );
    if (cook.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Cook not found"
      });
    }
    if (cook.rows[0].approved === true) {
      return res.status(400).json({
        success: false,
        message: "Approved cook cannot be rejected"
      });
    }
    await pool.query(
      `DELETE FROM cooks
       WHERE id = $1`,
      [id]
    );
    res.status(200).json({
      success: true,
      message: "Cook rejected successfully"
    });
  } catch (error) {
    console.log("Reject Cook Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};

/* ===========================================
   Get All Users
=========================================== */
const getAllUsers = async (req, res) => {
  try {
    const users = await pool.query(`
      SELECT
        users.id,
        users.name,
        users.email,
        users.phone,
        users.role,
        users.created_at,
        cooks.id AS cook_id,
        cooks.approved AS cook_approved
      FROM users
      LEFT JOIN cooks
        ON users.id = cooks.user_id
      ORDER BY users.created_at DESC
    `);

    res.status(200).json({
      success: true,
      users: users.rows
    });

  } catch (error) {
    console.log("Get Users Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};

/* ===========================================
   Get All Orders
=========================================== */
const getAllOrders = async (req, res) => {
  try {

    const orders = await pool.query(`
      SELECT
        orders.id,
        customer.name AS customer_name,
        cookUser.name AS cook_name,
        menus.dish_name,
        orders.quantity,
        orders.total_price,
        orders.order_status,
        orders.order_date
      FROM orders

      JOIN users customer
      ON orders.user_id = customer.id

      JOIN cooks
      ON orders.cook_id = cooks.id

      JOIN users cookUser
      ON cooks.user_id = cookUser.id

      JOIN menus
      ON orders.menu_id = menus.id

      ORDER BY orders.order_date DESC
    `);

    res.status(200).json(orders.rows);

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server Error"
    });
  }
};

/* ===========================================
   Get All Subscriptions
=========================================== */
const getAllSubscriptions = async (req, res) => {
  try {
    const subscriptions = await pool.query(`
      SELECT
        subscriptions.id,
        customer.name AS customer_name,
        cookUser.name AS cook_name,
        subscriptions.plan_type,
        subscriptions.status,
        subscriptions.start_date
      FROM subscriptions
      JOIN users customer
      ON subscriptions.user_id = customer.id

      JOIN cooks
      ON subscriptions.cook_id = cooks.id

      JOIN users cookUser
      ON cooks.user_id = cookUser.id

      ORDER BY subscriptions.start_date DESC
    `);
    res.status(200).json({
      success: true,
      subscriptions: subscriptions.rows
    });
  } catch (error) {
    console.log("Get All Subscriptions Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};
const getAllCuisines = async (req, res) => {
  try {
    const cuisines = await pool.query(`
      SELECT
        cuisine,
        COUNT(*) AS meals
      FROM menus
      WHERE cuisine IS NOT NULL
        AND TRIM(cuisine) <> ''
      GROUP BY cuisine
      ORDER BY cuisine ASC
    `);
    res.status(200).json({
      success: true,
      cuisines: cuisines.rows
    });
  } catch (error) {
    console.log("Get All Cuisines Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};
const getAllCategories = async (req, res) => {
  try {
    const categories = await pool.query(`
      SELECT
        meal_type AS category,
        COUNT(*) AS meals
      FROM menus
      WHERE meal_type IS NOT NULL
        AND TRIM(meal_type) <> ''
      GROUP BY meal_type
      ORDER BY meal_type ASC
    `);

    res.status(200).json({
      success: true,
      categories: categories.rows
    });

  } catch (error) {
    console.log("Get All Categories Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};
const updateCuisine = async(req,res)=>{
  try{
    const {name} = req.params;
    const {newName} = req.body;
    if(!newName || !newName.trim()){
      return res.status(400).json({
        success: false,
        message: "New cuisine name is required"
      });
    }
    const oldCuisine = name.trim();
    const updatedCuisine = newName.trim();
    if(oldCuisine === updatedCuisine){
      return res.status(400).json({
        success:false,
        message:"New cuisine name must be different"
      });
    }
    const existing = await pool.query(
      `SELECT COUNT(*) AS count
      FROM menus 
      WHERE LOWER(cuisine)=LOWER($1)`,[updatedCuisine]
    );
    if(existing.rows[0].count > 0){
      return res.status(400).json({
        success: false,
        message: "Cuisine already exists"
      });
    }
    const updated = await pool.query(
      `UPDATE menus
      SET cuisine=$1
      WHERE cuisine=$2
      RETURNING id`,[updatedCuisine,oldCuisine]
    );
    if(updated.rows.length === 0){
      return res.status(404).json({
        success:false,
        message:"Cuisine not found"
      });
    }
    res.status(200).json({
      success:true,
      message:"Cuisine updated successfully",
      updatedMeals:updated.rows.length
    });
  }catch(error){
    console.log("Update Cuisine Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};
const updateCategory = async(req,res)=>{
  try{
    const { name } = req.params;
    const { newName } = req.body;
    if (!newName || !newName.trim()) {
      return res.status(400).json({
        success: false,
        message: "New category name is required"
      });
    }
    const oldCategory = name.trim();
    const updatedCategory = newName.trim();
    if (oldCategory === updatedCategory) {
      return res.status(400).json({
        success: false,
        message: "New category name must be different"
      });
    }
    const existing = await pool.query(
      `
      SELECT COUNT(*) AS count
      FROM menus
      WHERE LOWER(meal_type) = LOWER($1)
      `,
      [updatedCategory]
    );
    if (Number(existing.rows[0].count) > 0) {
      return res.status(400).json({
        success: false,
        message: "Category already exists"
      });
    }
    const updated = await pool.query(
      `
      UPDATE menus
      SET meal_type = $1
      WHERE meal_type = $2
      RETURNING id
      `,
      [updatedCategory, oldCategory]
    );
    if (updated.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Category not found"
      });
    }
    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      updatedMeals: updated.rows.length
    });
  }catch(error){
    console.log(error);
    return res.status(500).json({
      success:false,
      message:"Server Error"
    });
  }
};
const getAllComplaints = async (req, res) => {
  try {
    const complaints = await pool.query(
      `
      SELECT
        complaints.id,
        complaints.user_id,
        complaints.order_id,
        complaints.description,
        complaints.status,
        complaints.created_at,

        customer.name AS customer_name,
        customer.email AS customer_email,

        cooks.id AS cook_id,
        cook_user.name AS cook_name,
        cook_user.email AS cook_email,

        cook_response.message AS cook_response,
        cook_response.created_at AS cook_response_date

      FROM complaints

      JOIN users customer
        ON complaints.user_id = customer.id

      LEFT JOIN cooks
        ON complaints.cook_id = cooks.id

      LEFT JOIN users cook_user
        ON cooks.user_id = cook_user.id

      LEFT JOIN LATERAL (
        SELECT
          message,
          created_at
        FROM complaint_messages
        WHERE complaint_id = complaints.id
        AND sender_role = 'cook'
        ORDER BY created_at DESC
        LIMIT 1
      ) cook_response
        ON true
      ORDER BY complaints.created_at DESC
      `
    );
    res.status(200).json({
      success: true,
      complaints: complaints.rows
    });
  } catch (error) {
    console.log("Get All Complaints Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};
const getComplaintById = async (req, res) => {
  try {
    const { id } = req.params;

    const complaint = await pool.query(
      `
      SELECT
        complaints.id,
        complaints.user_id,
        complaints.order_id,
        complaints.description,
        complaints.status,
        complaints.created_at,

        customer.name AS customer_name,
        customer.email AS customer_email,
        customer.phone AS customer_phone,

        cooks.id AS cook_id,
        cook_user.name AS cook_name,
        cook_user.email AS cook_email,
        cook_user.phone AS cook_phone,

        cook_response.message AS cook_response,
        cook_response.created_at AS cook_response_date

      FROM complaints

      JOIN users customer
        ON complaints.user_id = customer.id

      LEFT JOIN cooks
        ON complaints.cook_id = cooks.id

      LEFT JOIN users cook_user
        ON cooks.user_id = cook_user.id

      LEFT JOIN LATERAL (
        SELECT
          message,
          created_at
        FROM complaint_messages
        WHERE complaint_id = complaints.id
        AND sender_role = 'cook'
        ORDER BY created_at DESC
        LIMIT 1
      ) cook_response
        ON true

      WHERE complaints.id = $1
      `,
      [id]
    );

    if (complaint.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found"
      });
    }

    res.status(200).json({
      success: true,
      complaint: complaint.rows[0]
    });

  } catch (error) {
    console.error("Get Complaint By ID Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};
const updateComplaintStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = [
      "Open",
      "In Progress",
      "Resolved"
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid complaint status"
      });
    }

    const complaint = await pool.query(
      `SELECT id
       FROM complaints
       WHERE id = $1`,
      [id]
    );

    if (complaint.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found"
      });
    }

    const updated = await pool.query(
      `UPDATE complaints
       SET status = $1
       WHERE id = $2
       RETURNING id, order_id, description, status, created_at`,
      [status, id]
    );

    res.status(200).json({
      success: true,
      message: "Complaint status updated successfully",
      complaint: updated.rows[0]
    });

  } catch (error) {
    console.log("Update Complaint Status Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};
const assignComplaintToCook = async (req, res) => {
  try {
    const { id } = req.params;
    const { cook_id } = req.body;

    if (!cook_id) {
      return res.status(400).json({
        success: false,
        message: "Cook ID is required"
      });
    }

    // Check complaint exists
    const complaint = await pool.query(
      `
      SELECT
        id,
        status,
        cook_id
      FROM complaints
      WHERE id = $1
      `,
      [id]
    );

    if (complaint.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found"
      });
    }

    // Don't assign resolved complaints
    if (complaint.rows[0].status === "Resolved") {
      return res.status(400).json({
        success: false,
        message: "Resolved complaint cannot be assigned"
      });
    }

    // Check that the cook exists
    const cook = await pool.query(
      `
      SELECT
        cooks.id,
        cooks.user_id,
        users.name,
        users.email
      FROM cooks
      JOIN users
        ON cooks.user_id = users.id
      WHERE cooks.id = $1
      `,
      [cook_id]
    );

    if (cook.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Cook not found"
      });
    }

    // Assign cook to complaint
    const updatedComplaint = await pool.query(
      `
      UPDATE complaints
      SET
        cook_id = $1,
        status = 'In Progress'
      WHERE id = $2
      RETURNING *
      `,
      [cook_id, id]
    );

    res.status(200).json({
      success: true,
      message: "Complaint assigned to cook successfully",
      complaint: updatedComplaint.rows[0]
    });

  } catch (error) {
    console.error("Assign Complaint Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};
const getAllCooks = async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT
        cooks.id,
        cooks.user_id,
        users.name,
        users.email
      FROM cooks
      JOIN users
        ON cooks.user_id = users.id
      ORDER BY users.name ASC
      `
    );

    res.status(200).json({
      success: true,
      cooks: result.rows
    });

  } catch (error) {
    console.error("Get All Cooks Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};
module.exports = {
  getDashboardStats,
  getPendingCooks,
  approveCook,
  rejectCook,
  getAllUsers,
  getAllOrders,
  getAllSubscriptions,
  getAllCuisines,
  getAllCategories,
  updateCuisine,
  updateCategory,
  getAllComplaints,
  getComplaintById,
  updateComplaintStatus,
  assignComplaintToCook,
  getAllCooks
};