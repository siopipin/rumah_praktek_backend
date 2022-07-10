const express = require("express");
const router = express.Router();

const userCtrl = require("../controllers/user");
const checkAuth = require("../middleware/check-auth");

router.get("/users", checkAuth, userCtrl.users);

module.exports = router;
