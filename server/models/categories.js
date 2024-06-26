const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;
const categorySchema = new mongoose.Schema(
  {
    cName: {
      type: String,
      required: true,
    },
    cDescription: {
      type: String,
      required: true,
    },
    cImage: {
      type: String,
      default: null,

    },
    cStatus: {
      type: String,
      required: true,
    },
    cParentCategory: {
      type: ObjectId,
      ref: "categories",
    },
  },
  { timestamps: true }
);

const categoryModel = mongoose.model("categories", categorySchema);
module.exports = categoryModel;
