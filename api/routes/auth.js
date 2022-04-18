const express = require("express");
const router = express.Router();

const authCtrl = require("../controllers/auth");

//Tekniker auth
router.post("/login", authCtrl.login);
router.post("/registration", authCtrl.registration);
router.post("/reset", authCtrl.reset);
module.exports = router;
