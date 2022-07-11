const express = require("express");
const router = express.Router();

const settingCtrl = require("../controllers/settings");
const checkAuth = require("../middleware/check-auth");

router.get("/", settingCtrl.settings);
router.put("/", checkAuth, settingCtrl.settingsEdit);

module.exports = router;
