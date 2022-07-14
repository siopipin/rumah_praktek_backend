const express = require("express");
const router = express.Router();

const serviceCtrl = require("../controllers/service");
const checkAuth = require("../middleware/check-auth");

router.get("/", serviceCtrl.services);
router.get("/:serviceId", checkAuth, serviceCtrl.serviceDetail);
router.post("/", checkAuth, serviceCtrl.servicesAdd);
router.put("/:serviceId", checkAuth, serviceCtrl.servicesEdit);
router.delete("/:serviceId", checkAuth, serviceCtrl.servicesDelete);

module.exports = router;
