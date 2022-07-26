const express = require("express");
const router = express.Router();
const variables = require("../../variables");
const multer = require("multer");

const postCtrl = require("../controllers/post");
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

router.get("/", postCtrl.posts);
router.get("/all", postCtrl.postsAll);
router.post("/", checkAuth, uploadImg.single("images"), postCtrl.postAdd);
router.get("/detail/:postId", postCtrl.postDetail);
router.put(
  "/detail/:postId",
  checkAuth,
  uploadImg.single("images"),
  postCtrl.postEdit
);

router.delete("/detail/:postId", checkAuth, postCtrl.postDelete);

module.exports = router;
