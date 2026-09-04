const pool = require("../db");
const createcookProfile = async (req, res) => {
  try {
    const { bio, service_area, delivery_timings } = req.body;
    const userId = req.user.userId;
    const imageUrl = req.file ? `/uploads/cooks/${req.file.filename}` : null;
    const existingCook = await pool.query(
      "SELECT * FROM cooks WHERE user_id=$1",
      [userId],
    );
    if (existingCook.rows.length > 0) {
      return res.status(400).json({
        message: "Cook profile already exists",
      });
    }
    const newCook = await pool.query(
      `INSERT INTO cooks
      (user_id,bio,service_area,delivery_timings,image_url)
      VALUES($1,$2,$3,$4,$5)
      RETURNING *`,
      [userId, bio, service_area, delivery_timings, imageUrl],
    );
    res.status(201).json({
      message: "Cook profile created",
      cook: newCook.rows[0],
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
};
const getCookProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const cook = await pool.query(
      `
            SELECT
                users.name,
                users.email,
                users.phone,
                cooks.bio,
                cooks.service_area,
                cooks.delivery_timings,
                cooks.rating,
                cooks.approved,
                cooks.earnings,
                cooks.image_url
            FROM cooks
            JOIN users
            ON cooks.user_id = users.id
            WHERE cooks.user_id = $1
            `,
      [userId],
    );
    if (cook.rows.length === 0) {
      return res.status(404).json({
        message: "Cook not found",
      });
    }
    res.status(200).json({ success: true, profile: cook.rows[0] });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
};
const updateCookProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { name, phone, bio, service_area, delivery_timings } = req.body;
    const imageUrl = req.file ? `/uploads/cooks/${req.file.filename}` : null;
    if (!name || !phone || !bio || !service_area || !delivery_timings) {
      return res.status(400).json({
        message: "All fields are required.",
      });
    }
    await pool.query(
      `UPDATE users
            SET
              name = $1,
              phone = $2
            WHERE id = $3
            `,
      [name, phone, userId],
    );
    if (imageUrl) {
      await pool.query(
        `UPDATE cooks
     SET
       bio = $1,
       service_area = $2,
       delivery_timings = $3,
       image_url = $4
     WHERE user_id = $5`,
        [bio, service_area, delivery_timings, imageUrl, userId],
      );
    } else {
      await pool.query(
        `UPDATE cooks
     SET
       bio = $1,
       service_area = $2,
       delivery_timings = $3
     WHERE user_id = $4`,
        [bio, service_area, delivery_timings, userId],
      );
    }
    const updatedProfile = await pool.query(
      `SELECT
                users.name,
                users.email,
                users.phone,
                cooks.bio,
                cooks.service_area,
                cooks.delivery_timings,
                cooks.rating,
                cooks.approved,
                cooks.earnings
            FROM cooks
            JOIN users
            ON cooks.user_id = users.id
            WHERE cooks.user_id = $1
            `,
      [userId],
    );
    res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      profile: updatedProfile.rows[0],
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
};
const getMyComplaints = async (req, res) => {
  try {
    const cookUserId = req.user.userId;
    const complaints = await pool.query(
      `SELECT
        complaints.id,
        complaints.order_id,
        complaints.description,
        complaints.status,
        complaints.created_at,

        customer.name AS customer_name

       FROM complaints

       JOIN cooks
         ON complaints.cook_id = cooks.id

       JOIN users customer
         ON complaints.user_id = customer.id

       WHERE cooks.user_id = $1

       ORDER BY complaints.created_at DESC`,
      [cookUserId],
    );
    res.status(200).json({
      success: true,
      complaints: complaints.rows,
    });
  } catch (error) {
    console.log("Get Cook Complaints Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
const respondToComplaint = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const { message } = req.body;
    if (!message || !message.trim()) {
      return res.status(403).json({
        success: false,
        message: "Response message is required",
      });
    }
    const complaint = await pool.query(
      `SELECT 
        complaints.id,
        complaints.status,
        cooks.id AS cook_id
        FROM complaints 
        JOIN cooks 
        ON complaints.cook_id = cooks.id
        WHERE complaints.id = $1
        AND cooks.user_id = $2`,
      [id, userId],
    );
    if (complaint.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found",
      });
    }

    // Don't allow response after admin has resolved it
    if (complaint.rows[0].status === "Resolved") {
      return res.status(400).json({
        success: false,
        message: "Resolved complaints cannot be responded to",
      });
    }
    const result = await pool.query(
      `
      INSERT INTO complaint_messages
      (
        complaint_id,
        sender_id,
        sender_role,
        message
      )
      VALUES ($1, $2, $3, $4)
      RETURNING *
      `,
      [id, userId, "cook", message.trim()],
    );

    // Move complaint to In Progress
    await pool.query(
      `
      UPDATE complaints
      SET status = 'In Progress'
      WHERE id = $1
      `,
      [id],
    );

    res.status(201).json({
      success: true,
      message: "Response submitted successfully",
      response: result.rows[0],
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
const getCookApprovalStatus = async (req, res) => {
  try {
    const userId = req.user.userId;

    const result = await pool.query(
      `
      SELECT id, approved
      FROM cooks
      WHERE user_id = $1
      `,
      [userId],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Cook profile not found",
      });
    }

    res.status(200).json({
      success: true,
      approved: result.rows[0].approved,
    });
  } catch (error) {
    console.log("Get Cook Approval Status Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
module.exports = {
  createcookProfile,
  getCookProfile,
  updateCookProfile,
  getMyComplaints,
  respondToComplaint,
  getCookApprovalStatus,
};
