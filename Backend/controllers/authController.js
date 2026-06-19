const pool = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
    try{
        const { name,email,password,phone,role } = req.body;
        const existingUser = await pool.query(`SELECT * FROM users WHERE email = $1`, [email]);
        if (existingUser.rows.length > 0) {
            return res.status(400).json({ message: "User already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await pool.query(
            `INSERT INTO users (name, email, password, phone, role) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [name, email, hashedPassword, phone, role]
        );
        res.status(201).json({ message: "User registered successfully", user: newUser.rows[0], });
    }catch(error){
       console.log(error);
         res.status(500).json({ message: "Server error" });
    }
};
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await pool.query(`SELECT * FROM users WHERE email = $1`, [email]);
        if (user.rows.length === 0) {
            return res.status(400).json({ message: "Invalid email or password" });
        }  
        const validPassword = await bcrypt.compare(password, user.rows[0].password);
        if (!validPassword) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        const token = jwt.sign({ userId: user.rows[0].id, role: user.rows[0].role }, process.env.JWT_SECRET, { expiresIn: "7d" });
        res.status(200).json({token, 
            user: { 
            id: user.rows[0].id, 
            name: user.rows[0].name, 
            email: user.rows[0].email, 
            phone: user.rows[0].phone, 
            role: user.rows[0].role 
        }, 
    });
    }catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
};
module.exports = { register, login };