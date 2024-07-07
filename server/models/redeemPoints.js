const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const redeemPointSchema = new mongoose.Schema(
  {
    rPoint: {
      type: Number,
      default: 0,
      required: true,
    },
    rMethod: {
      type: String,
      default: "Amount",
      enum: [
        "Amount",
        "Percent"
      ],
      required: true,
    },
    rAmount: {
      type: Number,
      default: 0,
    },
    rPercent: {
      type: Number,
      default: 0,
    },
    rCategory: {
      type: ObjectId,
      ref: "categories",
    },
    rApply: {
      type: String,
      default: "Yes",
      enum: [
        "Yes",
        "No"
      ],
      required: true,
    },
    rStatus: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const redeemPointModel = mongoose.model("redeemPoints", redeemPointSchema);
module.exports = redeemPointModel;
