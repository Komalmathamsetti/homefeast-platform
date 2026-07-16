const pool = require("../db");
const getAllCooks = async(req,res)=>{
    try{
        const cooks = await pool.query(
            `SELECT DISTINCT
            c.id,
            u.name,
            c.bio,
            c.service_area,
            c.delivery_timings,
            c.rating,
            MIN(m.price) AS starting_price,
            MIN(m.cuisine) AS cuisine
            FROM cooks c
            JOIN users u
            ON c.user_id=u.id
            LEFT JOIN menus m
            ON c.id=m.cook_id
            GROUP BY
            c.id,
            u.name,
            c.bio,
            c.service_area,
            c.delivery_timings,
            c.rating;`
        );
        res.status(200).json(cooks.rows);
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
const filterCooks = async (req, res) => {
    try {
        const {
            search,
            cuisine,
            mealType,
            mealPlan,
            maxPrice
        } = req.query;
        let query = `
        SELECT DISTINCT
            c.id,
            u.name,
            c.bio,
            c.service_area,
            c.delivery_timings,
            c.rating,
            m.price AS starting_price,
            m.cuisine
        FROM cooks c
        JOIN users u
            ON c.user_id = u.id
        LEFT JOIN menus m
            ON c.id = m.cook_id
        WHERE 1=1
        `;
        const values = [];
        if (search) {
            values.push(`%${search}%`);
            query += `
            AND (
                LOWER(u.name) LIKE LOWER($${values.length})
                OR LOWER(c.bio) LIKE LOWER($${values.length})
                OR LOWER(c.service_area) LIKE LOWER($${values.length})
            )
            `;
        }
        if (cuisine) {
            values.push(cuisine);
            query += `
            AND m.cuisine = $${values.length}
            `;
        }
        if (mealType) {
            values.push(mealType);
            query += `
            AND m.meal_type = $${values.length}
            `;
        }
        if (mealPlan) {
            values.push(mealPlan);
            query += `
            AND m.meal_plan = $${values.length}
            `;
        }
        if (maxPrice) {
            values.push(maxPrice);
            query += `
            AND m.price <= $${values.length}
            `;
        }
        const cooks = await pool.query(query, values);
        res.status(200).json(cooks.rows);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server Error"
        });
    }
};
module.exports={
    getAllCooks,
    getCookDetails,
    filterCooks
};