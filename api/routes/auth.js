const express = require("express");
const router = express.Router();

const authCtrl = require("../controllers/auth");
const checkAuth = require("../middleware/check-auth");

router.post("/login", authCtrl.login);
router.post("/register", authCtrl.registration);
router.post("/reset", authCtrl.reset);
router.get("/me", checkAuth, authCtrl.me);

module.exports = router;
