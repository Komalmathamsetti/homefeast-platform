const pool = require("../db");

const createcookProfile = async (req, res) => {
  try {
    const { bio, service_area, delivery_timings } = req.body;

    const userId = req.user.userId;

    const existingCook = await pool.query(
      "SELECT * FROM cooks WHERE user_id=$1",
      [userId]
    );

    if (existingCook.rows.length > 0) {
      return res.status(400).json({
        message: "Cook profile already exists"
      });
    }

    const newCook = await pool.query(
      `INSERT INTO cooks
      (user_id,bio,service_area,delivery_timings)
      VALUES($1,$2,$3,$4)
      RETURNING *`,
      [userId, bio, service_area, delivery_timings]
    );

    res.status(201).json({
      message: "Cook profile created",
      cook: newCook.rows[0]
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server Error"
    });
  }
};
const getCookProfile = async (req, res) => {
  try {

    const id = req.params.id;

    const cook = await pool.query(
      "SELECT * FROM cooks WHERE id=$1",
      [id]
    );

    if (cook.rows.length === 0) {
      return res.status(404).json({
        message: "Cook not found"
      });
    }

    res.status(200).json(cook.rows[0]);

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error"
    });
  }
};
const updateCookProfile = async (req, res) => {
  try {

    const userId = req.user.userId;

    const {
      bio,
      service_area,
      delivery_timings
    } = req.body;

    const updatedCook = await pool.query(
      `UPDATE cooks
      SET bio=$1,
      service_area=$2,
      delivery_timings=$3
      WHERE user_id=$4
      RETURNING *`,
      [
        bio,
        service_area,
        delivery_timings,
        userId
      ]
    );

    res.status(200).json({
      message: "Cook profile updated",
      cook: updatedCook.rows[0]
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error"
    });
  }
};
module.exports = {
    createcookProfile,
    getCookProfile,
    updateCookProfile
};