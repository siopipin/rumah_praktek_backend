const express = require("express");
const router = express.Router();

const antrianCtrl = require("../controllers/antrian");
const checkAuth = require("../middleware/check-auth");

router.get("/", checkAuth, antrianCtrl.antrian);
router.post("/", checkAuth, antrianCtrl.antrianAdd);
router.put("/list/:queueId", checkAuth, antrianCtrl.antrianEdit);
router.get("/list/:queueId", checkAuth, antrianCtrl.antrianDetail);
router.get("/user/:userId", checkAuth, antrianCtrl.antrianUser);
router.delete("/list/:queueId", checkAuth, antrianCtrl.antrianDelete);

module.exports = router;
