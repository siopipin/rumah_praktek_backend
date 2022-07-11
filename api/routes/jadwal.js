const express = require("express");
const router = express.Router();

const jadwalCtrl = require("../controllers/jadwal");
const checkAuth = require("../middleware/check-auth");

router.get("/", checkAuth, jadwalCtrl.jadwal);
router.post("/", checkAuth, jadwalCtrl.jadwalAdd);
router.get("/detail/:scheduleId", checkAuth, jadwalCtrl.jadwalDetail);
router.put("/detail/:scheduleId", checkAuth, jadwalCtrl.jadwalEdit);
router.get("/todays", jadwalCtrl.jadwalHariIni);

module.exports = router;
