const express = require('express');
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");
const authorizeRole = require("../middleware/roleMiddleware");
const {placeOrder,getMyOrders,getCookOrders,updateOrderStatus} = require("../controllers/orderController");
router.post(
"/",
verifyToken,
authorizeRole("customer"),
placeOrder
);

router.get(
"/my",
verifyToken,
authorizeRole("customer"),
getMyOrders
);

router.get(
"/cook",
verifyToken,
authorizeRole("cook"),
getCookOrders
);

router.put(
"/:id",
verifyToken,
authorizeRole("cook"),
updateOrderStatus
);

module.exports = router;