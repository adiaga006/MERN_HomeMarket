const express = require("express");
const router = express.Router();
const redeemPointController = require("../controller/redeemPoints");
const multer = require("multer");
const { loginCheck } = require("../middleware/auth");

// Image Upload setting
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads/discounts");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.get("/all-redeem", redeemPointController.getAllRedeemPoint);
router.get("/all-redeem-admin", redeemPointController.getAllRedeemPoint_Admin);

router.post(
  "/add-redeem",
  //upload.single("cImage"),
  redeemPointController.postAddRedeemPoint
);
router.post("/edit-redeem", loginCheck, redeemPointController.postEditRedeemPoint);
router.post(
  "/delete-redeem",
  loginCheck,
  redeemPointController.getDeleteRedeemPoint
);

module.exports = router;
