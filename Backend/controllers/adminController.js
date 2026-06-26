const pool = require("../db");
const getAllUsers = async(req,res)=>{
    try{
       const users = await pool.query(
        `SELECT 
           id,
           name,
           email,
           phone,
           role,
           created_at
        FROM users
        ORDER BY created_at DESC`
       );
       res.status(200).json(users.rows);
    }catch(error){
        console.log(error);
        res.status(500).json({message:"Server Error"});
    }
};
const getAllCooks = async(req,res)=>{
    try{
        const cooks = await pool.query(
            `SELECT 
                cooks.*,
                users.name,
                users.email,
                users.phone
            FROM cooks
            JOIN users 
            ON cooks.user_id = users.id
            ORDER BY cooks.id DESC`
        );
        res.status(200).json(cooks.rows);
    }catch(error){
      console.log(error);
      res.status(500).json({message:"Server Error"});
    }
};
const approveCook = async (req, res) => {
    try {
        const cookId = req.params.id;
        const cook = await pool.query(
            `SELECT *
             FROM cooks
             WHERE id = $1`,
            [cookId]
        );
        if (cook.rows.length === 0) {
            return res.status(404).json({
                message: "Cook not found"
            });
        }
        const updated = await pool.query(
            `UPDATE cooks
             SET approved = true
             WHERE id = $1
             RETURNING *`,
            [cookId]
        );
        res.status(200).json({message: "Cook approved successfully",cook: updated.rows[0]});
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Server Error"});
    }
};
const rejectCook = async(req,res)=>{
    try{
        const cookId = req.params.id;
        const cook = await pool.query(
            `SELECT *
             FROM cooks
             WHERE id = $1`,
            [cookId]
        );
        if (cook.rows.length === 0) {
            return res.status(404).json({
                message: "Cook not found"
            });
        }
        const updated = await pool.query(
            `UPDATE cooks
             SET approved = false
             WHERE id = $1
             RETURNING *`,
            [cookId]
        );
        res.status(200).json({message: "Cook rejected",cook: updated.rows[0]});
    }catch (error) {
        console.log(error);
        res.status(500).json({message: "Server Error"});
    }
};
const getAllOrders = async (req, res) => {
    try {
        const orders = await pool.query(
            `SELECT
                orders.*,
                users.name AS customer_name
             FROM orders
             JOIN users
             ON orders.user_id = users.id
             ORDER BY orders.order_date DESC`
        );
        res.status(200).json(orders.rows);
    }catch(error){
        console.log(error);
        res.status(500).json({message: "Server Error"});
    }
};
const getAllSubscriptions = async (req, res) => {
    try {
        const subscriptions = await pool.query(
            `SELECT
                subscriptions.*,
                users.name
             FROM subscriptions
             JOIN users
             ON subscriptions.user_id = users.id
             ORDER BY subscriptions.created_at DESC`
        );
        res.status(200).json(subscriptions.rows);
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Server Error"});
    }
};
const dashboardStats = async (req, res) => {
    try {
        const users = await pool.query(
            "SELECT COUNT(*) FROM users"
        );
        const cooks = await pool.query(
            "SELECT COUNT(*) FROM cooks"
        );
        const orders = await pool.query(
            "SELECT COUNT(*) FROM orders"
        );
        const subscriptions = await pool.query(
            "SELECT COUNT(*) FROM subscriptions"
        );
        res.status(200).json({
            totalUsers: users.rows[0].count,
            totalCooks: cooks.rows[0].count,
            totalOrders: orders.rows[0].count,
            totalSubscriptions: subscriptions.rows[0].count
        });
    }catch(error){
        console.log(error);
        res.status(500).json({message: "Server Error"});
    }
};
module.exports = {
    getAllUsers,
    getAllCooks,
    approveCook,
    rejectCook,
    getAllOrders,
    getAllSubscriptions,
    dashboardStats
};