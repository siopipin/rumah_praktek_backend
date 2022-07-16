const express = require("express");
const multer = require("multer");
const router = express.Router();
const variables = require("../../variables");
const userCtrl = require("../controllers/user");
const checkAuth = require("../middleware/check-auth");

var storageFileName = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, variables.PATH + "/assets/images");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname);
  },
});

let uploadImg = multer({ storage: storageFileName });

router.get("/", checkAuth, userCtrl.users);
router.get("/:userId", checkAuth, userCtrl.usersDetail);
router.put(
  "/:userId",
  checkAuth,
  uploadImg.single("images"),
  userCtrl.userEdit
);
router.get("/:userId/history", checkAuth, userCtrl.usersHistory);
router.post("/:userId/history", checkAuth, userCtrl.usersHistoryAdd);
module.exports = router;
