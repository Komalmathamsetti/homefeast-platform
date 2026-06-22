const pool = require("../db");
const getAllCooks = async(req,res)=>{
    try{
        const cooks = await pool.query(
            `SELECT cooks.id,
             cooks.bio,
             cooks.service_area,
             cooks.delivery_timings,
             cooks.rating,
             users.name
             FROM cooks
             JOIN users
             ON cooks.user_id = users.id
             WHERE cooks.approved = true`
        );
        res.status(200).json(cooks.rows);
    }catch(error){
        console.log(error);
        res.status(500).json({message:"Server Error"});
    }
};
const searchByCuisine = async(req,res)=>{
    try{
        const { cuisine } = req.query;
        const result = await pool.query(
            "SELECT * FROM menus WHERE cuisine ILIKE $1",
            [`%${cuisine}%`]
        );
        res.status(200).json(result.rows);
    }catch(error){
        console.log(error);
        res.status(500).json({message:"Server Error"});
    }
};
const filterByMealType = async(req,res)=>{
    try{
        const { meal_type } = req.query;
        const result = await pool.query(
          `SELECT * FROM menus
           WHERE LOWER(meal_type) = LOWER($1)`,
           [meal_type]
        );
        res.status(200).json(result.rows);
    }catch(error){
        console.log(error);
        res.status(500).json({message:"Server Error"});
    }
};
const filterByPrice = async(req,res)=>{
    try{
        const { minPrice,maxPrice } = req.query;
        const result = await pool.query(`
            SELECT * FROM menus WHERE price BETWEEN $1 AND $2`,
            [minPrice,maxPrice]
        );
        res.status(200).json(result.rows);
    }catch(error){
        console.log(error);
        res.status(500).json({message:"Server Error"});
    }
};
const getCookDetails = async(req,res)=>{
    try{
        const cookId = req.params.id;
        const cook = await pool.query(
            `SELECT cooks.*,users.name
            FROM cooks JOIN users 
            ON cooks.user_id = users.id
            WHERE cooks.id = $1`,
            [cookId]
        );
        if(cook.rows.length === 0){
            res.status(404).json({message: "Cook Not found"});
        }
        const menus = await pool.query(
            `SELECT * FROM menus WHERE cook_id = $1`,
            [cookId]
        );
        res.status(200).json({cook:cook.rows[0],
            menus:menus.rows
        });
    }catch(error){
        console.log(error);
        res.status(500).json({message: "Server Error"});
    }
};
module.exports={
    getAllCooks,
    searchByCuisine,
    filterByMealType,
    filterByPrice,
    getCookDetails
};