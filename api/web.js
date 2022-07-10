const express = require("express");
const router = express.Router();
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");

router.use("/auth", authRoutes);
router.use("/users", userRoutes);

module.exports = router;
