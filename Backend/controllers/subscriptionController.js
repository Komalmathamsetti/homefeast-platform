const pool = require("../db");
const createSubscription = async(req,res)=>{
   try{
       const userId = req.user.userId;
       const { cook_id, plan_type } = req.body;
       const existing = await pool.query(
        `SELECT * FROM subscriptions
        WHERE user_id = $1
        AND cook_id = $2
        AND status = 'Active'`,
        [userId,cook_id]
       );
       if(existing.rows.length>0){
        return res.status(400).json({message: "Subscription already exists"});
       }
       const subscription = await pool.query(
        `INSERT INTO subscriptions
        (user_id,cook_id,plan_type,start_date)
        VALUES($1,$2,$3,CURRENT_TIMESTAMP)
        RETURNING *`,
        [userId,cook_id,plan_type]
       );
       res.status(201).json({message: "Subscription created",subscription: subscription.rows[0]});
   }catch(error){
    console.log(error);
    res.status(500).json({message: "Server Error"});
   }
};
const getMySubscriptions = async(req,res)=>{
    try {
        const userId = req.user.userId;
        const subscriptions = await pool.query(
            `SELECT
                subscriptions.*,
                users.name,
                cooks.service_area,
                cooks.delivery_timings,
                menus.cuisine,
                menus.price
            FROM subscriptions
            JOIN cooks
            ON subscriptions.cook_id = cooks.id
            JOIN users
            ON cooks.user_id = users.id
            LEFT JOIN menus
            ON menus.cook_id = cooks.id
            WHERE subscriptions.user_id = $1`,
            [userId]
        );
        res.status(200).json(subscriptions.rows);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server Error"
        });
    }
};
const cancelSubscription = async(req,res)=>{
    try{
        const subscriptionId = req.params.id;
        const userId = req.user.userId;
        const subscription = await pool.query(
            `SELECT * FROM 
            subscriptions WHERE id = $1`,[subscriptionId]
        );
        if(subscription.rows.length === 0){
            return res.status(404).json({message:"Subscription not found"});
        }
        if(subscription.rows[0].user_id !== userId){
            return res.status(403).json({message:"Unauthorized"});
        }
        const cancelled = await pool.query(
            `UPDATE subscriptions
            SET status = 'Cancelled'
            WHERE id = $1
            RETURNING *`,
            [subscriptionId]
        );
        res.status(200).json({message:"Subscription cancelled",subscription: cancelled.rows[0]});
    }catch(error){
        console.log(error);
        res.status(500).json({message: "Server Error"});
    }
};
const getCookSubscribers = async(req,res)=>{
   try{
    const userId = req.user.userId;
    const cook = await pool.query(
        `SELECT * FROM cooks
        WHERE user_id = $1`,[userId]
    );
    if(cook.rows.length === 0){
       return res.status(404).json({message: "Cook not found"});
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
    [cook.rows[0].id]
    );
    res.status(200).json(subscribers.rows);
   }catch(error){
    console.log(error);
    res.status(500).json({message:"Server Error"});
   }
};
module.exports = {
    createSubscription,
    getMySubscriptions,
    cancelSubscription,
    getCookSubscribers
};