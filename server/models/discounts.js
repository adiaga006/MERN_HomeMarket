const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const discountSchema = new mongoose.Schema(
  {
    dName: {
      type: String,
      required: true,
    },
    dMethod: {
      type: String,
      default: "Amount",
      enum: [
        "Amount",
        "Percent"
      ],
      required: true,
    },
    dAmount: {
      type: Number,
      default: 0,
    },
    dPercent: {
      type: Number,
      default: 0,
    },
    dCategory: {
      type: ObjectId,
      ref: "categories",
    },
    dApply: {
      type: String,
      default: "Yes",
      enum: [
        "Yes",
        "No"
      ],
      required: true,
    },
    dStatus: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const discountModel = mongoose.model("discounts", discountSchema);
module.exports = discountModel;
