const express = require('express');
const router = express.Router();
const { getAllCooks, searchByCuisine, filterByMealType, filterByPrice, getCookDetails } = require("../controllers/searchController");
router.get("/cooks",getAllCooks);
router.get("/search",searchByCuisine);
router.get("/mealtype",filterByMealType);
router.get("/price",filterByPrice);
router.get("/cook/:id",getCookDetails);
module.exports = router;