const pool = require("../db");
const getCookDashboard = async(req,res)=>{
    try{
    const userId = req.user.userId;
    const cookResult = await pool.query(
      `SELECT id 
       FROM cooks
       WHERE user_id = $1`,[userId]
    );
    if(cookResult.rows.length === 0){
      return res.status(403).json({
        success:false,
        message:"Cook not found"
      });
    }
    const cookId = cookResult.rows[0].id;
    const totalOrders = await pool.query(
        `SELECT COUNT(*) AS total_orders
        FROM orders
        WHERE cook_id = $1`,[cookId]
    );
    const earnings = await pool.query(
        `SELECT COALESCE(SUM(total_price), 0) AS earnings
        FROM orders
        WHERE cook_id = $1
        AND order_status = 'Delivered'`,[cookId]
    );
    const meals=await pool.query(
        `SELECT COUNT(*)
        FROM menus
        WHERE cook_id=$1`,[cookId]
    );
    const subscribers=await pool.query(
        `SELECT COUNT(*)
        FROM subscriptions
        WHERE cook_id=$1
        AND status='Active'`,[cookId]
    );
    const recentOrders=await pool.query(
        `SELECT
        orders.id,
        orders.quantity,
        orders.order_status,
        users.name AS customer_name,
        menus.dish_name
        FROM orders
        JOIN users
        ON orders.user_id = users.id
        JOIN menus
        ON orders.menu_id = menus.id
        WHERE orders.cook_id = $1
        ORDER BY orders.order_date DESC
        LIMIT 5`,[cookId]
    );
    const recentSubscribers=await pool.query(
        `SELECT
        users.name,
        subscriptions.plan_type,
        subscriptions.status
        FROM subscriptions
        JOIN users
        ON subscriptions.user_id=users.id
        WHERE subscriptions.cook_id=$1
        ORDER BY subscriptions.start_date DESC
        LIMIT 5`,[cookId]
    );
    res.json({
        summary:{
            orders:Number(totalOrders.rows[0].total_orders),
            earnings:Number(earnings.rows[0].earnings),
            meals:Number(meals.rows[0].count),
            subscriptions:Number(subscribers.rows[0].count)
        },
        recentOrders:recentOrders.rows,
        recentSubscribers:recentSubscribers.rows
    });
    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Server Error"
        });
    }
};
module.exports = { getCookDashboard };