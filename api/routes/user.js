const express = require("express");
const router = express.Router();

const userCtrl = require("../controllers/user");
const checkAuth = require("../middleware/check-auth");

router.get("/", checkAuth, userCtrl.users);
router.get("/:userId", checkAuth, userCtrl.usersDetail);
router.put("/:userId", checkAuth, userCtrl.userEdit);
router.get("/:userId/history", checkAuth, userCtrl.usersHistory);

module.exports = router;
