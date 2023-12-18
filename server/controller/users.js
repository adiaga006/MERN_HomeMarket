const userModel = require("../models/users");
const bcrypt = require("bcryptjs");
const cloudinary = require('cloudinary')

class User {
  async getAllUser(req, res) {
    try {
      let Users = await userModel
        .find({})
        .sort({ _id: -1 });
      if (Users) {
        return res.json({ Users });
      }
    } catch (err) {
      console.log(err);
    }
  }

  async getSingleUser(req, res) {
    let { uId } = req.body;
    if (!uId) {
      return res.json({ error: "All filled must be required" });
    } else {
      try {
        let User = await userModel
          .findById(uId)
          .select("name email phoneNumber userImage updatedAt createdAt");
        if (User) {
          return res.json({ User });
        }
      } catch (err) {
        console.log(err);
      }
    }
  }

  async postAddUser(req, res) {
    let { allProduct, user, amount, transactionId, address, phone } = req.body;
    if (
      !allProduct ||
      !user ||
      !amount ||
      !transactionId ||
      !address ||
      !phone
    ) {
      return res.json({ message: "All filled must be required" });
    } else {
      try {
        let newUser = new userModel({
          allProduct,
          user,
          amount,
          transactionId,
          address,
          phone,
        });
        let save = await newUser.save();
        if (save) {
          return res.json({ success: "User created successfully" });
        }
      } catch (err) {
        return res.json({ error: error });
      }
    }
  }

  async postAdminEditUser(req, res) {
    let { uId, role } = req.body;
    if (!uId || !role) {
      return res.json({ message: "All filled must be required" });
    } else {
      let currentUser = userModel.findByIdAndUpdate(uId, {
        userRole: role,
        updatedAt: Date.now(),
      });
      currentUser.exec((err, result) => {
        if (err) console.log(err);
        return res.json({ success: "User updated successfully" });
      });
    }
  }

  async postEditUser(req, res) {
    try {
      const { uId, name, phoneNumber } = req.body;

      if (!uId || !name) {
        return res.status(400).json({ message: "All fields must be required" });
      }

      // if (!req.file) {
      //   return res.status(400).json({ error: "Missing file in the request" });
      // }

      const deleteUserImage = await userModel.findById(uId);

      if (deleteUserImage && deleteUserImage.userImage) {
        await cloudinary.v2.uploader.destroy(deleteUserImage.userImage.public_id);
      }

      const result = await cloudinary.v2.uploader.upload(req.file.path, {
        folder: 'avatars',
        width: 150,
        crop: "scale"
      });

      const currentUser = await userModel.findByIdAndUpdate(uId, {
        name: name,
        phoneNumber: phoneNumber,
        userImage: {
          public_id: result.public_id,
          url: result.secure_url
        },
        updatedAt: Date.now(),
      });

      if (!currentUser) {
        return res.status(404).json({ error: "User not found" });
      }

      return res.json({ success: "User updated successfully" });
    } catch (err) {
      console.error("Error updating user:", err);
      return res.status(500).json({ error: "An error occurred while updating user" });
    }
  }
  
  async getDeleteUser(req, res) {
    let { oId, status } = req.body;
    if (!oId || !status) {
      return res.json({ message: "All filled must be required" });
    } else {
      let currentUser = userModel.findByIdAndUpdate(oId, {
        status: status,
        updatedAt: Date.now(),
      });
      currentUser.exec((err, result) => {
        if (err) console.log(err);
        return res.json({ success: "User updated successfully" });
      });
    }
  }

  async postDeleteUser(req, res) {
    let { uId } = req.body;
    if (!uId) {
      return res.json({ error: "All filled must be required" });
    } else {
      try {
        let deleteUser = await userModel.findByIdAndDelete(uId);
        if (deleteUser) {
          return res.json({ success: "User deleted successfully" });
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  async changePassword(req, res) {
    let { uId, oldPassword, newPassword } = req.body;
    if (!uId || !oldPassword || !newPassword) {
      return res.json({ message: "All filled must be required" });
    } else {
      const data = await userModel.findOne({ _id: uId });
      if (!data) {
        return res.json({
          error: "Invalid user",
        });
      } else {
        const oldPassCheck = await bcrypt.compare(oldPassword, data.password);
        if (oldPassCheck) {
          newPassword = bcrypt.hashSync(newPassword, 10);
          let passChange = userModel.findByIdAndUpdate(uId, {
            password: newPassword,
          });
          passChange.exec((err, result) => {
            if (err) console.log(err);
            return res.json({ success: "Password updated successfully" });
          });
        } else {
          return res.json({
            error: "Your old password is wrong!!",
          });
        }
      }
    }
  }
}

const ordersController = new User();
module.exports = ordersController;