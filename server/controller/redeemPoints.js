const { log } = require("console");
const { toTitleCase } = require("../config/function");
const redeemPointModel = require("../models/redeemPoints");
const fs = require("fs");
class redeemPoint {
  async getAllRedeemPoint(req, res) {
    try {
      let redeemPoints = await redeemPointModel
      .find({rStatus: "Active"})
      .populate("rCategory", "_id cName")
      .sort({ _id: -1 });
      if (redeemPoints) {
        return res.json({ redeemPoints });
      }
    } catch (err) {
      console.log(err);
    }
  }
  async getAllRedeemPoint_Admin(req, res) {
    try {
      let redeemPoints = await redeemPointModel
      .find({ rStatus: { $in: ["Active", "Disabled"]} })
      .populate("rCategory", "_id cName")
      .sort({ _id: -1 });
      if (redeemPoints) {
        return res.json({ redeemPoints });
      }
    } catch (err) {
      console.log(err);
    }
  }
  async postAddRedeemPoint(req, res) {
    let { rPoint,  rMethod, rAmount, rPercent, rCategory, rApply, rStatus} = req.body;
    console.log( rPoint, rMethod, rAmount, rPercent, rCategory, rApply, rStatus );  
    if (!rPoint || !rMethod || !rCategory || !rApply || !rStatus) {
        return res.json({ error: "All filled must be required" });
    } else {
      try {
          let newRedeemPoint = new redeemPointModel({
            rPoint,
            rMethod,
            rAmount,
            rPercent,
            rCategory,
            rApply,
            rStatus
          });
          await newRedeemPoint.save((err) => {
            if (!err) {
              return res.json({ success: "Redeem created successfully" });
            }
          });
      } catch (err) {
        console.log(err);
      }
    }
  }

  async postEditRedeemPoint(req, res) {
    let { rId, rPoint, rMethod, rAmount, rPercent, rCategory, rApply, rStatus } = req.body;
    
    if (!rId || !rPoint || !rMethod || !rCategory || !rApply || !rStatus) {
      return res.json({ error: "All fields must be required" });
    }  
    try {
      
      const editData = {
        rPoint,
        rMethod,
        rAmount,
        rPercent,
        rCategory,
        rApply,
        rStatus,
        updatedAt: Date.now()
      };
      // Update the category
      let editRedeemPoint = await redeemPointModel.findByIdAndUpdate(rId, editData);
  
      if (editRedeemPoint) {
        return res.json({ success: "Redeem point edited successfully" });
      }
    } catch (err) {
      console.log(err);
      return res.json({ error: "Error editing redeem point" });
    }
  }
  
  async getDeleteRedeemPoint(req, res) {
    let { rId } = req.body;
    if (!rId) {
      return res.json({ error: "All fields must be required" });
    } else {
      let deletedObj=await redeemPointModel.findById(rId);
      try {
        // Thay đổi cStatus thành "Disabled" cho category cần xóa mềm
        let deleteRedeemPoint = await redeemPointModel.findByIdAndUpdate(
          rId,
          { rStatus: "Not available" ,},
          { new: true } // Trả về bản ghi đã được cập nhật
        );
        if (deleteRedeemPoint) {
          return res.json({ success: "Redeem point deleted successfully" });
        }
        if (deleteRedeemPoint) {
          return res.json({ success: "Redeem point deleted successfully" });
      }
     } catch (err) {
        console.log(err);
        return res.json({ error: "An error occurred while deleting the redeem point " });
      }
    }
  }
}

const redeemPointController = new redeemPoint();
module.exports = redeemPointController;