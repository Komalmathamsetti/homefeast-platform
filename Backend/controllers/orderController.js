const pool = require("../db");
 
const placeOrder = async(req,res)=>{
    try{
        const userId = req.user.userId;
        const { menu_id, quantity } = req.body;
        const menu = await pool.query(
            `SELECT * FROM menus WHERE id = $1`,[menu_id]
        );
        if(menu.rows.length === 0){
            return res.status(404).json({message: "Menu not found"});
        }
        const totalPrice = menu.rows[0].price*quantity;
        const order = await pool.query(
            `INSERT INTO orders
            (user_id,cook_id,menu_id,quantity,total_price)
            VALUES ($1,$2,$3,$4,$5)
            RETURNING *`,
            [userId,menu.rows[0].cook_id,menu_id,quantity,totalPrice]
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
        `SELECT * FROM orders
        WHERE user_id = $1`,[userId]
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
            `SELECT * FROM orders
             WHERE cook_id = $1`,
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
const updateOrderStatus = async(req,res)=>{
    try{
       const orderId = req.params.id;
       const { status } = req.body;
       const order = await pool.query(
        `UPDATE orders 
        SET order_status = $1
        WHERE id = $2
        RETURNING *`,[status,orderId]
       );
       res.status(200).json({message:"Order updated",order:order.rows[0]});
    }catch(error){
        console.log(error);
        res.status(500).json({message:"Server Error"});
    }
};
module.exports = {
    placeOrder,
    getMyOrders,
    getCookOrders,
    updateOrderStatus
};