const express = require("express");
const router = express.Router();

const jadwalCtrl = require("../controllers/jadwal");
const checkAuth = require("../middleware/check-auth");

router.get("/", checkAuth, jadwalCtrl.jadwal);
router.post("/", checkAuth, jadwalCtrl.jadwalAdd);
router.get("/detail/:scheduleId", checkAuth, jadwalCtrl.jadwalDetail);
router.get("/todays", jadwalCtrl.jadwalHariIni);

// router.put("/list/:queueId", checkAuth, antrianCtrl.antrianEdit);
// router.get("/list/:queueId", checkAuth, antrianCtrl.antrianDetail);
// router.get("/user/:userId", checkAuth, antrianCtrl.antrianUser);
// router.delete("/list/:queueId", checkAuth, antrianCtrl.antrianDelete);

module.exports = router;
