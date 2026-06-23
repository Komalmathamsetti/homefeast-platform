const express = require('express');
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");
const authorizeRole = require("../middleware/roleMiddleware");
const { createSubscription,getMySubscriptions,cancelSubscription,getCookSubscribers } = require("../controllers/subscriptionController");
router.post(
"/",
verifyToken,
authorizeRole("customer"),
createSubscription
);

router.get(
"/my",
verifyToken,
authorizeRole("customer"),
getMySubscriptions
);

router.put(
"/cancel/:id",
verifyToken,
authorizeRole("customer"),
cancelSubscription
);

router.get(
"/cook",
verifyToken,
authorizeRole("cook"),
getCookSubscribers
);

module.exports = router;