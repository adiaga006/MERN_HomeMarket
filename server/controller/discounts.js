const { log } = require("console");
const { toTitleCase } = require("../config/function");
const discountModel = require("../models/discounts");
const fs = require("fs");
class Discount {
  async getAllDiscount(req, res) {
    try {
      let Discounts = await discountModel
      .find({dStatus: "Active"})
      .populate("dCategory", "_id cName")
      .sort({ _id: -1 });
      if (Discounts) {
        return res.json({ Discounts });
      }
    } catch (err) {
      console.log(err);
    }
  }
  async getAllDiscount_Admin(req, res) {
    try {
      let Discounts = await discountModel
      .find({ dStatus: { $in: ["Active", "Disabled"]} })
      .populate("dCategory", "_id cName")
      .sort({ _id: -1 });
      if (Discounts) {
        return res.json({ Discounts });
      }
    } catch (err) {
      console.log(err);
    }
  }
  async postAddDiscount(req, res) {
    let { dName,  dMethod, dAmount, dPercent, dCategory, dApply, dStatus} = req.body;
    //let cImage = req.file.filename;
    //const filePath = `../server/public/uploads/categories/${cImage}`;
    console.log(dCategory);
    if (!dName || !dMethod || !dCategory || !dApply || !dStatus) {
        return res.json({ error: "All filled must be required" });
     
    } else {
      dName = toTitleCase(dName);
      try {
        let checkDiscountExists = await discountModel.findOne({ dName: dName });
        if (checkDiscountExists) {
            return res.json({ error: "Discount already exists" });
      
        } else {
          let newDiscount = new discountModel({
            dName,
            dMethod,
            dAmount,
            dPercent,
            dCategory,
            dApply,
            dStatus
          });
          await newDiscount.save((err) => {
            if (!err) {
              return res.json({ success: "Discount created successfully" });
            }
          });
        }
      } catch (err) {
        console.log(err);
      }
    }
  }

  async postEditDiscount(req, res) {
    let { dId, dName, dMethod, dAmount, dPercent, dCategory,  dApply, dStatus } = req.body;
    
    if (!dId || !dName || !dMethod || !dCategory || !dApply || !dStatus) {
      return res.json({ error: "All fields must be required" });
    }
  
    // Trim trailing spaces from category name
    dName = dName.trim();
  
    try {
      // Check if the new category name is unique
      const isNameUnique = await discountModel.findOne({ dName, _id: { $ne: dId } });
      if (isNameUnique) {
        return res.json({ error: "Discount name must be unique" });
      }

      const editData = {
        dName,
        dMethod,
        dAmount,
        dPercent,
        dCategory,
        dApply,
        dStatus,
        updatedAt: Date.now()
      };
      // Update the category
      let editDiscount = await discountModel.findByIdAndUpdate(dId, editData);
  
      if (editDiscount) {
        return res.json({ success: "Discount edited successfully" });
      }
    } catch (err) {
      console.log(err);
      return res.json({ error: "Error editing discount" });
    }
  }
  
  async getDeleteDiscount(req, res) {
    let { dId } = req.body;
    if (!dId) {
      return res.json({ error: "All fields must be required" });
    } else {
      let deletedObj=await discountModel.findById(dId);
      let oldName=deletedObj.dName;
      try {
        // Thay đổi cStatus thành "Disabled" cho category cần xóa mềm
        let deleteDiscount = await discountModel.findByIdAndUpdate(
          dId,
          { dStatus: "Not available" ,
            dName: `${oldName} (Discount deleted)`,},
          { new: true } // Trả về bản ghi đã được cập nhật
        );

      } catch (err) {
        console.log(err);
        return res.json({ error: "An error occurred while deleting the category and associated products" });
      }
    }
  }
}

const discountController = new Discount();
module.exports = discountController;
