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
  updateCategory
};