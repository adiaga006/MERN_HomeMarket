const fs = require("fs");
const categoryModel = require("../models/categories");
const productModel = require("../models/products");
const orderModel = require("../models/orders");
const userModel = require("../models/users");
const customizeModel = require("../models/customize");
const cloudinary = require('cloudinary')


class Customize {
  async getImages(req, res) {
    try {
      let Images = await customizeModel.find({});
      if (Images) {
        return res.json({ Images });
      }
    } catch (err) {
      console.log(err);
    }
  }

  async uploadSlideImage(req, res) {
    try {
      let image = [];
  
      if (!req.file || !req.file.filename) {
        return res.json({ error: "All fields required" });
      }
  
      const result = await cloudinary.v2.uploader.upload(req.file.path, { folder: 'customizes' });
  
      // Gán trực tiếp vào slideImage
      let newCustomzie = new customizeModel({
        slideImage: {
          public_id: result.public_id,
          url: result.secure_url
        }
      });
  
      let save = await newCustomzie.save();
  
      if (save) {
        return res.json({ success: "Image upload successfully" });
      }
    } catch (err) {
      console.log(err);
      res.json({ error: "Error uploading image" });
    }
  }
  
  async deleteSlideImage(req, res) {
    let { id } = req.body;
    if (!id) {
      return res.json({ error: "All field required" });
    } else {
      try {
        let deletedSlideImage = await customizeModel.findById(id);
        await cloudinary.v2.uploader.destroy(deletedSlideImage.slideImage.public_id);

        let deleteImage = await customizeModel.findByIdAndDelete(id);
        if (deleteImage) {
            return res.json({ success: "Image deleted successfully" });
        }
      } catch (err) {
        console.log(err);
      }
    }
  }

  async getAllData(req, res) {
    try {
      let Categories = await categoryModel.find({}).count();
      let Products = await productModel.find({}).count();
      let Orders = await orderModel.find({}).count();
      let Users = await userModel.find({}).count();
      if (Categories && Products && Orders) {
        return res.json({ Categories, Products, Orders, Users });
      }
    } catch (err) {
      console.log(err);
    }
  }
}

const customizeController = new Customize();
module.exports = customizeController;
