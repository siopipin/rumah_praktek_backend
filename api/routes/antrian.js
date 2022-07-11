const express = require("express");
const router = express.Router();

const antrianCtrl = require("../controllers/antrian");
const checkAuth = require("../middleware/check-auth");

router.get("/", checkAuth, antrianCtrl.antrian);
router.post("/", checkAuth, antrianCtrl.antrianAdd);

// router.get("/:serviceId", checkAuth, serviceCtrl.serviceDetail);
// router.put("/:serviceId", checkAuth, serviceCtrl.servicesEdit);
// router.delete("/:serviceId", checkAuth, serviceCtrl.servicesDelete);

module.exports = router;
