const pool = require("../db");
const addMenu = async (req, res) => {
  try {
    const { dish_name, meal_type, cuisine, price, availability } = req.body;
    const imageUrl = req.file ? `/uploads/dishes/${req.file.filename}` : null;
    const userId = req.user.userId;
    const cook = await pool.query("SELECT * FROM cooks WHERE user_id=$1", [
      userId,
    ]);
    if (cook.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Cook profile not found",
      });
    }
    const menu = await pool.query(
      `INSERT INTO menus
      (cook_id,dish_name,meal_type,cuisine,price,availability,image_url)
      VALUES($1,$2,$3,$4,$5,$6,$7)
      RETURNING *`,
      [
        cook.rows[0].id,
        dish_name,
        meal_type,
        cuisine,
        price,
        availability,
        imageUrl,
      ],
    );
    res.status(201).json({
      success: true,
      message: "Menu added successfully",
      menu: menu.rows[0],
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
};
const getAllMenus = async (req, res) => {
  try {
    const menus = await pool.query("SELECT * FROM menus");
    res.status(200).json(menus.rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
const getCookMenus = async (req, res) => {
  try {
    const userId = req.user.userId;
    const cook = await pool.query(
      `SELECT id
       FROM cooks
       WHERE user_id = $1`,
      [userId],
    );
    if (cook.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Cook profile not found",
      });
    }
    const menus = await pool.query(
      `SELECT *
       FROM menus
       WHERE cook_id = $1
       ORDER BY id DESC`,
      [cook.rows[0].id],
    );
    res.status(200).json({
      success: true,
      meals: menus.rows,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
const getMenuById = async (req, res) => {
  try {
    const id = req.params.id;
    const menu = await pool.query("SELECT * FROM menus WHERE id=$1", [id]);
    if (menu.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Menu not found",
      });
    }
    res.status(200).json(menu.rows[0]);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
const updateMenu = async (req, res) => {
  try {
    const menuId = req.params.id;
    const userId = req.user.userId;
    const cook = await pool.query("SELECT * FROM cooks WHERE user_id = $1", [
      userId,
    ]);
    if (cook.rows.length === 0) {
      return res.status(404).json({
        successs: false,
        message: "Cook profile not found",
      });
    }
    const menu = await pool.query("SELECT * FROM menus WHERE id = $1", [
      menuId,
    ]);
    if (menu.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Menu not found",
      });
    }
    if (menu.rows[0].cook_id !== cook.rows[0].id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }
    const { dish_name, meal_type, cuisine, price, availability } = req.body;
    const imageUrl = req.file ? `/uploads/dishes/${req.file.filename}` : null;
    let updatedMenu;

    if (imageUrl) {
      updatedMenu = await pool.query(
        `UPDATE menus
         SET dish_name = $1,
             meal_type = $2,
             cuisine = $3,
             price = $4,
             availability = $5,
             image_url = $6
         WHERE id = $7
         RETURNING *`,
        [dish_name, meal_type, cuisine, price, availability, imageUrl, menuId],
      );
    } else {
      updatedMenu = await pool.query(
        `UPDATE menus
         SET dish_name = $1,
             meal_type = $2,
             cuisine = $3,
             price = $4,
             availability = $5
         WHERE id = $6
         RETURNING *`,
        [dish_name, meal_type, cuisine, price, availability, menuId],
      );
    }
    res.status(200).json({
      success: true,
      message: "Menu updated successfully",
      menu: updatedMenu.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
const deleteMenu = async (req, res) => {
  try {
    const menuId = req.params.id;
    const userId = req.user.userId;
    const cook = await pool.query("SELECT * FROM cooks WHERE user_id=$1", [
      userId,
    ]);
    const menu = await pool.query("SELECT * FROM menus WHERE id=$1", [menuId]);
    if (menu.rows[0].cook_id !== cook.rows[0].id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }
    await pool.query("DELETE FROM menus WHERE id=$1", [menuId]);
    res.status(200).json({
      success: true,
      message: "Menu deleted",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
module.exports = {
  addMenu,
  getAllMenus,
  getCookMenus,
  getMenuById,
  updateMenu,
  deleteMenu,
};
