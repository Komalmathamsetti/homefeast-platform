const pool = require("../db");
 
const placeOrder = async(req,res)=>{
    try{
        const userId = req.user.userId;
        const { menu_id, quantity, delivery_address, special_instructions } = req.body;
        if (quantity <= 0) {
           return res.status(400).json({message: "Quantity must be at least 1"});
        }
        const menu = await pool.query(
            `SELECT * FROM menus WHERE id = $1`,[menu_id]
        );
        if(menu.rows.length === 0){
            return res.status(404).json({message: "Menu not found"});
        }
        if (!menu.rows[0].availability) {
            return res.status(400).json({message: "This meal is currently unavailable"});
        }
        const totalPrice = Number(menu.rows[0].price)*Number(quantity);
        const order = await pool.query(
            `INSERT INTO orders
            (user_id,cook_id,menu_id,quantity,total_price,delivery_address,special_instructions)
            VALUES ($1,$2,$3,$4,$5,$6,$7)
            RETURNING *`,
            [userId,menu.rows[0].cook_id,menu_id,quantity,totalPrice,delivery_address,special_instructions]
        );
        res.status(201).json({message:"Order Placed",order:order.rows[0]});
    }catch(error){
        console.log(error);
        res.status(500).json({message:"Server Error"});
    }
};
const getMyOrders = async(req,res)=>{
    try{
       const userId = req.user.userId;
       const orders = await pool.query(
        `SELECT
        orders.id,
        orders.quantity,
        orders.total_price,
        orders.order_status,
        orders.delivery_address,
        orders.special_instructions,
        orders.order_date,
        menus.dish_name,
        menus.price,
        menus.meal_type,
        users.name AS cook_name,
        cooks.service_area
        FROM orders
        JOIN menus
        ON orders.menu_id = menus.id
        JOIN cooks
        ON orders.cook_id = cooks.id
        JOIN users
        ON cooks.user_id = users.id
        WHERE orders.user_id = $1
        ORDER BY orders.order_date DESC;`,[userId]
       );
       res.status(200).json(orders.rows);
    }catch(error){
        console.log(error);
        res.status(500).json({message:"Server Error"});
    }
};
const getCookOrders = async(req,res)=>{
    try{

        const userId = req.user.userId;

        const cook = await pool.query(
            `SELECT * FROM cooks
             WHERE user_id = $1`,
            [userId]
        );

        if(cook.rows.length === 0){
            return res.status(404).json({
                message: "Cook profile not found"
            });
        }

        const orders = await pool.query(
            `SELECT
            orders.id,
            orders.quantity,
            orders.total_price,
            orders.order_status,
            orders.order_date,
            orders.delivery_address,
            orders.special_instructions,
            users.name AS customer_name,
            users.email AS customer_email,
            menus.dish_name,
            menus.meal_type,
            menus.price
            FROM orders
            INNER JOIN users
            ON orders.user_id = users.id
            INNER JOIN menus
            ON orders.menu_id = menus.id
            WHERE orders.cook_id = $1
            ORDER BY orders.order_date DESC`,
            [cook.rows[0].id]
        );
        res.status(200).json(orders.rows);
    }catch(error){
        console.log(error);
        res.status(500).json({
            message: "Server Error"
        });
    }
};
const updateOrderStatus = async (req, res) => {
    try {
        const userId = req.user.userId;
        const orderId = req.params.id;
        const { status } = req.body;
        const cook = await pool.query(
            `SELECT * FROM cooks
            WHERE user_id = $1`,[userId]
        );
        if(cook.rows.length === 0){
            return res.status(403).json({
                message:"Cook Not found"
            });
        }
        const order = await pool.query(
            `SELECT * FROM orders
             WHERE id = $1
             AND cook_id = $2`,
            [orderId,cook.rows[0].id]
        );
        if (order.rows.length === 0) {
            return res.status(404).json({
                message: "Order not found"
            });
        }
        const validateStatuses = [
            "Pending",
            "Preparing",
            "Ready",
            "Delivered"
        ];
        if(!validateStatuses.includes(status)){
            return res.status(403).json({
                message:"Invalid Status"
            });
        }
        const updatedOrder = await pool.query(
            `UPDATE orders
             SET order_status = $1
             WHERE id = $2
             RETURNING *`,
            [status, orderId]
        );
        res.status(200).json({
            message: "Order updated",
            order: updatedOrder.rows[0]
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server Error"
        });
    }
};
const cancelOrder = async (req, res) => {
    try {
        const userId = req.user.userId;
        const orderId = req.params.id;
        const order = await pool.query(
            `SELECT * FROM orders
             WHERE id = $1
             AND user_id = $2`,
            [orderId, userId]
        );
        if (order.rows.length === 0) {
            return res.status(404).json({
                message: "Order not found"
            });
        }
        if (
            order.rows[0].order_status === "Delivered"
        ) {
            return res.status(400).json({
                message: "Delivered orders cannot be cancelled"
            });
        }
        const cancelled = await pool.query(
            `UPDATE orders
             SET order_status = 'Cancelled'
             WHERE id = $1
             RETURNING *`,
            [orderId]
        );
        res.status(200).json({
            message: "Order Cancelled",
            order: cancelled.rows[0]
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server Error"
        });
    }
};
const getCookEarnings = async(req,res)=>{
    try{
      const userId = req.user.userId;
      const cook = await pool.query(
        `SELECT * FROM cooks
        WHERE user_id = $1`,[userId]
      );
      if(cook.rows.length === 0){
        return res.status(400).json({
            success:false,
            message:"Cook Not Found"
        });
      }
      const cookId = cook.rows[0].id;
      const today = await pool.query(
        `SELECT COALESCE(SUM(total_price),0) AS total
        FROM orders
        WHERE cook_id = $1
        AND order_status = 'Delivered'
        AND DATE(order_date) = CURRENT_DATE`,[cookId]
      );
      const weekly = await pool.query(
        `SELECT COALESCE(SUM(total_price),0) AS total
        FROM orders
        WHERE cook_id = $1
        AND order_status = 'Delivered'
        AND order_date >= CURRENT_DATE - INTERVAL '7 days'`,[cookId]
      );
      const monthly = await pool.query(
        `SELECT COALESCE(SUM(total_price),0) AS total
        FROM orders
        WHERE cook_id = $1
        AND order_status = 'Delivered'
        AND DATE_TRUNC('month',order_date) = DATE_TRUNC('month',CURRENT_DATE)`,[cookId]
      );
      const lifetime = await pool.query(
        `SELECT COALESCE(SUM(total_price),0) AS total
        FROM orders
        WHERE cook_id = $1
        AND order_status = 'Delivered'`,[cookId]
      );
      const transactions = await pool.query(
        `SELECT 
        orders.id,
        orders.order_date,
        orders.total_price,
        orders.order_status,
        users.name AS customer_name
        FROM orders
        JOIN users 
        ON orders.user_id = users.id
        WHERE orders.cook_id = $1
        ORDER BY orders.order_date DESC`,[cookId]
      );
      res.status(200).json({
        success:true,
        summary:{
            today:today.rows[0].total,
            weekly:weekly.rows[0].total,
            monthly:monthly.rows[0].total,
            lifetime:lifetime.rows[0].total
        },
        transactions:transactions.rows
    });
    }catch(error){
        console.log(error);
        return res.status(500).json({
            sucess:false,
            message:"Server Error"
        });
    }
};
module.exports = {
    placeOrder,
    getMyOrders,
    getCookOrders,
    updateOrderStatus,
    cancelOrder,
    getCookEarnings
};