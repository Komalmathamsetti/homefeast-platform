const pool = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const { sendWelcomeMail } = require("../services/emailServices");
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const register = async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;
    const existingUser = await pool.query(
      `SELECT * FROM users WHERE email = $1`,
      [email],
    );
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await pool.query(
      `INSERT INTO users (name, email, password, phone, role) VALUES ($1, $2, $3, $4, $5) RETURNING*`,
      [name, email, hashedPassword, phone, role],
    );
    const userId = newUser.rows[0].id;
    if (role === "customer") {
      await pool.query(
        `INSERT INTO customer_profiles 
                (user_id,address) VALUES ($1,$2)`,
        [userId, ""],
      );
    }
    if (role === "cook") {
      await pool.query(
        `INSERT INTO cooks (user_id,bio,service_area,delivery_timings,approved,rating,earnings) VALUES ($1,'','','',false,0,0) RETURNING *`,
        [userId],
      );
    }
    res
      .status(201)
      .json({ message: "User registered successfully", user: newUser.rows[0] });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await pool.query(`SELECT * FROM users WHERE email = $1`, [
      email,
    ]);
    if (user.rows.length === 0) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const validPassword = await bcrypt.compare(password, user.rows[0].password);
    if (!validPassword) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign(
      { userId: user.rows[0].id, role: user.rows[0].role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );
    res.status(200).json({
      token,
      user: {
        id: user.rows[0].id,
        name: user.rows[0].name,
        email: user.rows[0].email,
        phone: user.rows[0].phone,
        role: user.rows[0].role,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};
const googleLogin = async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({
        message: "Google credential is required",
      });
    }

    // Verify the Google ID token
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    const { sub: googleId, email, name, email_verified } = payload;

    if (!email || !email_verified) {
      return res.status(401).json({
        message: "Google email could not be verified",
      });
    }

    // First check whether this Google account already exists
    const googleUser = await pool.query(
      `
            SELECT *
            FROM users
            WHERE google_id = $1
            `,
      [googleId],
    );

    let user;
    let isNewUser = false;

    if (googleUser.rows.length > 0) {
      // Existing Google user
      user = googleUser.rows[0];
    } else {
      // Check whether this email already exists
      const existingUser = await pool.query(
        `
                SELECT *
                FROM users
                WHERE email = $1
                `,
        [email],
      );

      if (existingUser.rows.length > 0) {
        // Existing HomeFeast account
        user = existingUser.rows[0];

        // Link Google account
        if (!user.google_id) {
          const updatedUser = await pool.query(
            `
                        UPDATE users
                        SET
                            google_id = $1,
                            auth_provider = 'google'
                        WHERE id = $2
                        RETURNING *
                        `,
            [googleId, user.id],
          );

          user = updatedUser.rows[0];
        }
      } else {
        // New Google account
        const newUser = await pool.query(
          `
                    INSERT INTO users
                    (
                        name,
                        email,
                        password,
                        phone,
                        role,
                        auth_provider,
                        google_id
                    )
                    VALUES
                    (
                        $1,
                        $2,
                        NULL,
                        $3,
                        $4,
                        $5,
                        $6
                    )
                    RETURNING *
                    `,
          [name || "Google User", email, "", "customer", "google", googleId],
        );

        user = newUser.rows[0];

        isNewUser = true;

        // Create customer profile
        await pool.query(
          `
                    INSERT INTO customer_profiles
                    (
                        user_id,
                        address
                    )
                    VALUES
                    (
                        $1,
                        $2
                    )
                    `,
          [user.id, ""],
        );
      }
    }

    // Send email only when a new account is created
    if (isNewUser) {
      try {
        await sendWelcomeMail(user.email, user.name);
      } catch (emailError) {
        console.log("Welcome Email Error:", emailError);

        // Email failure should not stop login
      }
    }

    // Create normal HomeFeast JWT
    const token = jwt.sign(
      {
        userId: user.id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    res.status(200).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    console.log("Google Login Error:", error);

    res.status(500).json({
      message: "Google Login Failed",
    });
  }
};
module.exports = { register, login, googleLogin };
