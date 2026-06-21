const pool = require("../db");
const addMenu = async (req, res) => {
  try {
    const {
      dish_name,
      meal_type,
      cuisine,
      price
    } = req.body;

    const userId = req.user.userId;

    const cook = await pool.query(
      "SELECT * FROM cooks WHERE user_id=$1",
      [userId]
    );

    if (cook.rows.length === 0) {
      return res.status(404).json({
        message: "Cook profile not found"
      });
    }

    const menu = await pool.query(
      `INSERT INTO menus
      (cook_id,dish_name,meal_type,cuisine,price)
      VALUES($1,$2,$3,$4,$5)
      RETURNING *`,
      [
        cook.rows[0].id,
        dish_name,
        meal_type,
        cuisine,
        price
      ]
    );

    res.status(201).json({
      message: "Menu added successfully",
      menu: menu.rows[0]
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server Error"
    });
  }
};
const getAllMenus = async (req, res) => {
  try {

    const menus = await pool.query(
      "SELECT * FROM menus"
    );

    res.status(200).json(menus.rows);

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error"
    });
  }
};
const getMenuById = async (req, res) => {
  try {

    const id = req.params.id;

    const menu = await pool.query(
      "SELECT * FROM menus WHERE id=$1",
      [id]
    );

    if (menu.rows.length === 0) {
      return res.status(404).json({
        message: "Menu not found"
      });
    }

    res.status(200).json(
      menu.rows[0]
    );

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error"
    });
  }
};
const updateMenu = async (req, res) => {
    try {
        const menuId = req.params.id;
        const userId = req.user.userId;

        const cook = await pool.query(
            "SELECT * FROM cooks WHERE user_id = $1",
            [userId]
        );

        if (cook.rows.length === 0) {
            return res.status(404).json({
                message: "Cook profile not found"
            });
        }

        const menu = await pool.query(
            "SELECT * FROM menus WHERE id = $1",
            [menuId]
        );

        if (menu.rows.length === 0) {
            return res.status(404).json({
                message: "Menu not found"
            });
        }

        if (menu.rows[0].cook_id !== cook.rows[0].id) {
            return res.status(403).json({
                message: "Unauthorized"
            });
        }

        const {
            dish_name,
            meal_type,
            cuisine,
            price
        } = req.body;

        const updatedMenu = await pool.query(
            `UPDATE menus
             SET dish_name = $1,
                 meal_type = $2,
                 cuisine = $3,
                 price = $4
             WHERE id = $5
             RETURNING *`,
            [
                dish_name,
                meal_type,
                cuisine,
                price,
                menuId
            ]
        );

        res.status(200).json({
            message: "Menu updated successfully",
            menu: updatedMenu.rows[0]
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Server Error"
        });
    }
};
const deleteMenu = async (req, res) => {
  try {

    const menuId = req.params.id;

    const userId = req.user.userId;

    const cook = await pool.query(
      "SELECT * FROM cooks WHERE user_id=$1",
      [userId]
    );

    const menu = await pool.query(
      "SELECT * FROM menus WHERE id=$1",
      [menuId]
    );

    if (
      menu.rows[0].cook_id !==
      cook.rows[0].id
    ) {
      return res.status(403).json({
        message: "Unauthorized"
      });
    }

    await pool.query(
      "DELETE FROM menus WHERE id=$1",
      [menuId]
    );

    res.status(200).json({
      message: "Menu deleted"
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error"
    });
  }
};
module.exports = {
    addMenu,
    getAllMenus,
    getMenuById,
    updateMenu,
    deleteMenu
};