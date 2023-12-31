const express = require("express");
const router = express.Router();
const usersController = require("../controller/users");
const multer = require("multer");

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "public/uploads/customize");
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + "_" + file.originalname);
    },
  }); 
  
const upload = multer({ storage: storage });

router.get("/all-user", usersController.getAllUser);
router.post("/signle-user", usersController.getSingleUser);

router.post("/edit-user",upload.single("editAvatar"), usersController.postEditUser);
router.post("/admin-edit-user", usersController.postAdminEditUser);
router.post("/delete-user", usersController.postDeleteUser);

router.post("/change-password", usersController.changePassword);

module.exports = router;