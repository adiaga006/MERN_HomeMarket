const express = require("express");
const router = express.Router();
const authController = require("../controller/auth");
const { loginCheck, isAuth, isAdmin } = require("../middleware/auth");

router.post("/isadmin", authController.isAdmin);
router.post("/signup", authController.postSignup);
router.post("/confirm_signup",authController.confirmSignup);
router.post("/OtpResetPass",authController.sendOtpForResetPassword);
router.post("/ResetPass",authController.resetPasswordAfterOtp);
router.post("/signin", authController.postSignin);
router.post("/user", loginCheck, isAuth, isAdmin, authController.allUser);

module.exports = router;
