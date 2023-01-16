const express = require("express");
const router = express.Router();

const antrianCtrl = require("../controllers/antrian");
const checkAuth = require("../middleware/check-auth");

router.get("/", checkAuth, antrianCtrl.antrian);
router.get("/all", checkAuth, antrianCtrl.antrianAll);
router.get("/filter/:scheduleId", checkAuth, antrianCtrl.antrianFilter);
router.post("/", checkAuth, antrianCtrl.antrianAddV2);
router.put("/list/:queueId", checkAuth, antrianCtrl.antrianEdit);
router.put("/estimasi/:queueId", checkAuth, antrianCtrl.antrianEstimasi);
router.get("/list/:queueId", checkAuth, antrianCtrl.antrianDetail);
router.get("/user/:userId", checkAuth, antrianCtrl.antrianUser);
router.put("/rekammedis/:userId", checkAuth, antrianCtrl.rekamMedisEdit);
router.delete("/list/:queueId", checkAuth, antrianCtrl.antrianDelete);

module.exports = router;
