const pool = require("../db");

const verifyCookApproved = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const result = await pool.query(
      `
            SELECT
                id,
                approved
            FROM cooks
            WHERE user_id = $1
            `,
      [userId],
    );

    if (result.rows.length === 0) {
      return res.status(403).json({
        success: false,
        message: "Cook profile not found",
      });
    }

    const cook = result.rows[0];

    if (cook.approved !== true) {
      return res.status(403).json({
        success: false,
        message: "Your cook registration is pending admin approval.",
      });
    }

    req.cook = cook;
    next();
  } catch (error) {
    console.log("Cook Approval Check Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

module.exports = verifyCookApproved;
