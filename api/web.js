const express = require("express");
const router = express.Router();
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const servicesRoutes = require("./routes/service");
const settingsRoutes = require("./routes/setting");
const antrianRoutes = require("./routes/antrian");

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/services", servicesRoutes);
router.use("/settings", settingsRoutes);
router.use("/queues", antrianRoutes);

module.exports = router;
