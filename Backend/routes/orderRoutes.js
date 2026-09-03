const express = require('express');
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");
const authorizeRole = require("../middleware/roleMiddleware");
const verifyCookApproved = require("../middleware/cookApprovalMiddleware");
const {placeOrder,getMyOrders,getCookOrders,updateOrderStatus,cancelOrder,getCookEarnings} = require("../controllers/orderController");
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
verifyCookApproved,
getCookOrders
);

router.put(
"/:id/status",
verifyToken,
authorizeRole("cook"),
verifyCookApproved,
updateOrderStatus
);
router.put(
    "/cancel/:id",
    verifyToken,
    cancelOrder
);
router.get(
    "/earnings",
    verifyToken,
    authorizeRole("cook"),
    verifyCookApproved,
    getCookEarnings
);

module.exports = router;