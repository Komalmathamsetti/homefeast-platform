const express = require('express');
const router = express.Router();
const { getAllCooks, getCookDetails, filterCooks } = require("../controllers/searchController");
router.get("/cooks",getAllCooks);
router.get("/filter",filterCooks)
router.get("/cook/:id",getCookDetails);
module.exports = router;