const pool = require("../db");
const addReview = async(req,res)=>{
    try{
        const userId = req.user.userId;
        const { cook_id,rating,review } = req.body;
        if(rating < 1 || rating > 5){
            return res.status(400).json({message:"Rating must be between 1 and 5"});
        }
        const cook = await pool.query(
            `SELECT * FROM cooks
            WHERE id = $1`,[cook_id]
        );
        if(cook.rows.length === 0){
            return res.status(404).json({message:"Cook not found"});
        }
        const deliveredOrder = await pool.query(
            `SELECT FROM orders
            WHERE user_id=$1 
            AND cook_id = $2
            AND order_status = 'Delivered'`,[userId,cook_id]
        );
        if(deliveredOrder.rows.length === 0){
            return res.status(403).json({message:"You can Review this cook only after the order is delivered"});
        }
        const existingReview = await pool.query(
            `SELECT * FROM reviews
            WHERE user_id = $1
            AND cook_id = $2`,[userId,cook_id]
        );
        if(existingReview.rows.length>0){
            return res.status(400).json({message:"You have already reviewed this cook"});
        }
        const newReview = await pool.query(
            `INSERT INTO reviews
            (user_id,cook_id,rating,comment)
            VALUES ($1,$2,$3,$4)
            RETURNING *`,[userId,cook_id,rating,review]
        );
        await pool.query(
            `UPDATE cooks 
            SET rating = (
                SELECT ROUND(AVG(rating),1)
                FROM reviews
                WHERE cook_id = $1
            )
                WHERE id = $1`,[cook_id]
        );
        res.status(200).json({message:"Review added successfully",review: newReview.rows[0]});
    }catch(error){
        console.log(error);
        res.status(500).json({message:"Server Error"});
    }
};
const getAllReviews = async(req,res)=>{
    try{
        const cookId = req.params.id;
        const reviews = await pool.query(
            `SELECT 
                reviews.id,
                reviews.rating,
                reviews.comment,
                reviews.created_at,
                users.name
            FROM reviews
            JOIN users 
            ON reviews.user_id = users.id
            WHERE reviews.cook_id = $1
            ORDER BY reviews.created_at DESC`,[cookId]
        );
        res.status(200).json(reviews.rows);
    }catch(error){
        console.log(error);
        res.status(500).json({message:"Server Error"});
    }
};
const getAverageRating = async(req,res)=>{
    try{
        const cookId = req.params.id;
        const averageRating = await pool.query(
            `SELECT
                ROUND(AVG(rating), 1) AS average_rating,
                COUNT(*) AS total_reviews
            FROM reviews
            WHERE cook_id = $1`,[cookId]
        );
        res.status(200).json(averageRating.rows[0]);
    }catch(error){
        console.log(error);
        res.status(500).json({message:"Server Error"});
    }
};
module.exports = {
   addReview,
   getAllReviews,
   getAverageRating
};