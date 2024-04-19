const express = require("express");
const router = express.Router();
const discountController = require("../controller/discounts");
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

router.get("/all-discount", discountController.getAllDiscount);
router.get("/all-discount-admin", discountController.getAllDiscount_Admin);

router.post(
  "/add-discount",
  //upload.single("cImage"),
  discountController.postAddDiscount
);
router.post("/edit-discount", loginCheck, discountController.postEditDiscount);
router.post(
  "/delete-discount",
  loginCheck,
  discountController.getDeleteDiscount
);

module.exports = router;
