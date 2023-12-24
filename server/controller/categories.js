const { toTitleCase } = require("../config/function");
const categoryModel = require("../models/categories");
const fs = require("fs");
const productModel=require("../models/products.js");
class Category {
  async getAllCategory(req, res) {
    try {
      let Categories = await categoryModel
      .find({cStatus: "Active"})
      .sort({ _id: -1 });
      if (Categories) {
        return res.json({ Categories });
      }
    } catch (err) {
      console.log(err);
    }
  }
  async getAllCategory_Admin(req, res) {
    try {
      let Categories = await categoryModel
      .find({ cStatus: { $in: ["Active", "Disabled"]} })
      .sort({ _id: -1 });
      if (Categories) {
        return res.json({ Categories });
      }
    } catch (err) {
      console.log(err);
    }
  }
  async postAddCategory(req, res) {
    let { cName, cDescription, cStatus } = req.body;
    // let cImage = req.file.filename;
    // const filePath = `../server/public/uploads/categories/${cImage}`;
    if (!cName || !cDescription || !cStatus ) {
        return res.json({ error: "All filled must be required" });
     
    } else {
      cName = toTitleCase(cName);
      try {
        let checkCategoryExists = await categoryModel.findOne({ cName: cName });
        if (checkCategoryExists) {
            return res.json({ error: "Category already exists" });
      
        } else {
          let newCategory = new categoryModel({
            cName,
            cDescription,
            cStatus,
          });
          await newCategory.save((err) => {
            if (!err) {
              return res.json({ success: "Category created successfully" });
            }
          });
        }
      } catch (err) {
        console.log(err);
      }
    }
  }

  async postEditCategory(req, res) {
    let { cId, cName, cDescription, cStatus } = req.body;
    
    if (!cId || !cName || !cDescription || !cStatus) {
      return res.json({ error: "All fields must be required" });
    }
  
    // Trim trailing spaces from category name
    cName = cName.trim();
  
    try {
      // Check if the new category name is unique
      const isNameUnique = await categoryModel.findOne({ cName, _id: { $ne: cId } });
      if (isNameUnique) {
        return res.json({ error: "Category name must be unique" });
      }
  
      // Update the category
      let editCategory = await categoryModel.findByIdAndUpdate(cId, {
        cName,
        cDescription,
        cStatus,
        updatedAt: Date.now(),
      });
  
      if (editCategory) {
        return res.json({ success: "Category edited successfully" });
      }
    } catch (err) {
      console.log(err);
      return res.json({ error: "Error editing category" });
    }
  }
  
  async getDeleteCategory(req, res) {
    let { cId } = req.body;
    if (!cId) {
      return res.json({ error: "All fields must be required" });
    } else {
      let deletedObj=await categoryModel.findById(cId);
      let oldName=deletedObj.cName;
      try {
        // Thay đổi cStatus thành "Disabled" cho category cần xóa mềm
        let deleteCategory = await categoryModel.findByIdAndUpdate(
          cId,
          { cStatus: "Not available" ,
            cName: `${oldName} (Category deleted)`,},
          { new: true } // Trả về bản ghi đã được cập nhật
        );
  
        if (deleteCategory) {
          // Thay đổi pStatus thành "Disabled" cho tất cả các product thuộc category
          let deleteProducts = await productModel.updateMany(
            { pCategory: cId },
            { pStatus: "Not available" }
          );
            return res.json({ success: "Category and associated products deleted successfully" });
        }
      } catch (err) {
        console.log(err);
        return res.json({ error: "An error occurred while deleting the category and associated products" });
      }
    }
  }
  



  
}

const categoryController = new Category();
module.exports = categoryController;
