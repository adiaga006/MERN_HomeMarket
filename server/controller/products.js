const productModel = require("../models/products");
const fs = require("fs");
const path = require("path");
const cloudinary = require('cloudinary')
async function deleteCloudinaryImages(images) {
  try {
    for (const image of images) {
      // Use the public_id of the image to delete it from Cloudinary
      await cloudinary.v2.uploader.destroy(image.public_id);
    }
    console.log('Images deleted from Cloudinary');
  } catch (error) {
    console.error('Error deleting images from Cloudinary:', error);
    throw error; // Throw the error to handle it in the calling function if needed
  }
}
class Product {
  // Delete Image from uploads -> products folder
  static deleteImages(images, mode) {
    var basePath =
      path.resolve(__dirname + "../../") + "/public/uploads/products/";
    console.log(basePath);
    for (var i = 0; i < images.length; i++) {
      let filePath = "";
      if (mode == "file") {
        filePath = basePath + `${images[i].filename}`;
      } else {
        filePath = basePath + `${images[i]}`;
      }
      console.log(filePath);
      if (fs.existsSync(filePath)) {
        console.log("Exists image");
      }
      fs.unlink(filePath, (err) => {
        if (err) {
          return err;
        }
      });
    }
  }

  async getAllProduct(req, res) {
    try {
      // Chỉ hiển thị sản phẩm có pStatus là "Active"
      let Products = await productModel
        .find({ pStatus: "Active" })
        .populate("pCategory", "_id cName")
        .sort({ _id: -1 });
  
      if (Products) {
        return res.json({ Products });
      }
    } catch (err) {
      console.log(err);
      return res.json({ error: "An error occurred while fetching products" });
    }
  }
  async getAllProduct_Admin(req, res) {
    try {
      // Hiển thị tất cả sản phẩm có pStatus là "Active" hoặc "Disabled"
      let Products = await productModel
        .find({ pStatus: { $in: ["Active", "Disabled","Not available"]} }) // Thêm điều kiện này để lọc sản phẩm chưa bị xóa mềm
        .populate("pCategory", "_id cName")
        .sort({ _id: -1 });
  
      if (Products) {
        return res.json({ Products });
      }
    } catch (err) {
      console.log(err);
      return res.json({ error: "An error occurred while fetching products" });
    }
  }
  

  async postAddProduct(req, res) {
    let { pName, pDescription, pPrice, pQuantity, pCategory, pOffer, pStatus } = req.body;
    let images = req.files;
  
    // Validation
    if (!pName || !pDescription || !pPrice || !pQuantity || !pCategory || !pOffer || !pStatus) {
      //Product.deleteImages(images, "file");
      return res.json({ error: "All fields must be required" });
    } else if (pName.length > 255 || pDescription.length > 3000) {
      //Product.deleteImages(images, "file");
      return res.json({
        error: "Name 255 & Description must not be 3000 characters long",
      });
    } else if (images.length < 1) {
      //Product.deleteImages(images, "file");
      return res.json({ error: "Need at least 1 images" });
    } else if (isNaN(pQuantity) || pQuantity < 0) {
      //Product.deleteImages(images, "file");
      return res.json({ error: "Quantity must be a non-negative number" });
    } else {
      try {
        pName=pName.trimEnd();
        // Kiểm tra trùng tên
        const existingProduct = await productModel.findOne({
          pName: { $regex: new RegExp("^" + pName + "$", "i") } });
        if (existingProduct) {
          //Product.deleteImages(images, "file");
          return res.json({ error: "Product with the same name already exists" });
        }
  
        let allImages = [];
        for (const img of images) {
          const result = await cloudinary.v2.uploader.upload(img.path, { folder: 'products' });
          allImages.push({
            public_id: result.public_id,
            url: result.secure_url
          });
        }

        let newProduct = new productModel({
          pImages: allImages,
          pName,
          pDescription,
          pPrice,
          pQuantity,
          pCategory,
          pOffer,
          pStatus,
        });
  
        let save = await newProduct.save();
        if (save) {
          return res.json({ success: "Product created successfully" });
        }
      } catch (err) {
        console.log(err);
        return res.json({ error: "An error occurred while saving the product" });
      }
    }
  }
  async postEditProduct(req, res) {
    const { pId, pName, pDescription, pPrice, pQuantity, pCategory, pOffer, pStatus } = req.body;
  
    if (!pId || !pName || !pDescription || !pPrice || !pQuantity || !pCategory || !pOffer || !pStatus) {
      return res.json({ error: "All fields must be required" });
    } else if (isNaN(pQuantity) || pQuantity < 0) {
      return res.json({ error: "Quantity must be a non-negative number" });
    } else if (pName.length > 255 || pDescription.length > 3000) {
      return res.json({ error: "Name must be 255 characters long, and Description must not exceed 3000 characters" });
    } else {
      try {
        const existingProduct = await productModel.findOne({ pName: { $regex: new RegExp("^" + pName + "$", "i") }, _id: { $ne: pId } });
        if (existingProduct) {
          return res.json({ error: "Product with the same name already exists" });
        }
  
        const product = await productModel.findById(pId);
  
        const editImages = req.files;
        let existingImages = [];
  
        if (!editImages || editImages.length === 0) {
          // No new images selected, reuse existing images
          existingImages = product.pImages || [];
        } else {
          // New images selected, upload and store them
          for (const image of editImages) {
            const result = await cloudinary.v2.uploader.upload(image.path, { folder: 'products' });
            existingImages.push({ public_id: result.public_id, url: result.secure_url });
          }
        }
  
        // Remove images from the cloud that are not present in the updated set
        if (product.pImages) {
          const cloudPublicIds = product.pImages.map(img => img.public_id);
          const updatedPublicIds = existingImages.map(img => img.public_id);
          const publicIdsToRemove = cloudPublicIds.filter(publicId => !updatedPublicIds.includes(publicId));
  
          for (const publicId of publicIdsToRemove) {
            await cloudinary.v2.uploader.destroy(publicId);
          }
        }
  
        const editData = {
          pName,
          pDescription,
          pPrice,
          pQuantity,
          pCategory,
          pOffer,
          pStatus,
          pImages: existingImages,
        };
  
        const editProduct = await productModel.findByIdAndUpdate(pId, editData);
  
        return res.json({ success: "Product edited successfully" });
  
      } catch (err) {
        console.log(err);
        return res.json({ error: "An error occurred while saving the product" });
      }
    }
  }
  
  
  

  async  getDeleteProduct(req, res) {
    let { pId } = req.body;
  
    if (!pId) {
      return res.json({ error: "All fields must be required" });
    } else {
      try {
        let deleteProductObj = await productModel.findById(pId);
  
        // Lấy tên sản phẩm
        let productName = deleteProductObj.pName;
  
        // Thực hiện cập nhật trạng thái sản phẩm
        let deleteProduct = await productModel.findByIdAndUpdate(
          pId,
          { 
            pStatus: "Not available",
            pName: `${productName} (The product is not available)`,
            pQuantity: 0
          },
          { new: true } // Trả về bản ghi đã được cập nhật
        );
  
        if (deleteProduct) {
          // Delete Image from uploads -> products folder
          await deleteCloudinaryImages(deleteProductObj.pImages);
  
          return res.json({ success: "Product deleted successfully" });
        }
      } catch (err) {
        console.log(err);
        return res.json({ error: "An error occurred while deleting the product" });
      }
    }
  }
  

  async getSingleProduct(req, res) {
    let { pId } = req.body;
    if (!pId) {
      return res.json({ error: "All filled must be required" });
    } else {
      try {
        let singleProduct = await productModel
          .findById(pId)
          .populate("pCategory", "cName")
          .populate("pRatingsReviews.user", "name email userImage");
        if (singleProduct) {
          return res.json({ Product: singleProduct });
        }
      } catch (err) {
        console.log(err);
      }
    }
  }

  async getProductByCategory(req, res) {
    let { catId } = req.body;
    if (!catId) {
      return res.json({ error: "All filled must be required" });
    } else {
      try {
        let products = await productModel
          .find({ pCategory: catId, pStatus: "Active" })
          .populate("pCategory", "cName");
        if (products) {
          return res.json({ Products: products });
        }
      } catch (err) {
        return res.json({ error: "Search product wrong" });
      }
    }
  }

  async getProductByPrice(req, res) {
    let { price } = req.body;
    if (!price) {
      return res.json({ error: "All filled must be required" });
    } else {
      try {
        let products = await productModel
          .find({ pPrice: { $lte: price }})
          .populate("pCategory", "cName")
          .sort({ pPrice: -1 });
        if (products) {
          return res.json({ Products: products });
        }
      } catch (err) {
        return res.json({ error: "Filter product wrong" });
      }
    }
  }

  async getWishProduct(req, res) {
    let { productArray } = req.body;
    if (!productArray) {
      return res.json({ error: "All filled must be required" });
    } else {
      try {
        let wishProducts = await productModel.find({
          _id: { $in: productArray },
        });
        if (wishProducts) {
          return res.json({ Products: wishProducts });
        }
      } catch (err) {
        return res.json({ error: "Filter product wrong" });
      }
    }
  }

  async getCartProduct(req, res) {
    let { productArray } = req.body;
    if (!productArray) {
      return res.json({ error: "All filled must be required" });
    } else {
      try {
        let cartProducts = await productModel.find({
          _id: { $in: productArray },
        });
        if (cartProducts) {
          return res.json({ Products: cartProducts });
        }
      } catch (err) {
        return res.json({ error: "Cart product wrong" });
      }
    }
  }

  async postAddReview(req, res) {
    try {
      const { pId, uId, rating, review } = req.body;
  
      if (!pId || !rating || !review || !uId) {
        return res.json({ error: "All fields must be required" });
      }
  
      const checkReviewRatingExists = await productModel.findOne({ _id: pId });
  
      if (checkReviewRatingExists.pRatingsReviews.some((item) => item.user === uId)) {
        return res.json({ error: "You have already reviewed the product" });
      }
  
      const newRatingReview = await productModel.findByIdAndUpdate(
        pId,
        {
          $push: {
            pRatingsReviews: { review: review, user: uId, rating: rating },
          },
        },
        { new: true }
      );
  
      if (!newRatingReview) {
        return res.json({ error: "Failed to add review" });
      }
  
      const avgRating = newRatingReview.pRatingsReviews.reduce((acc, item) => item.rating + acc, 0) / newRatingReview.pRatingsReviews.length;
  
      await productModel.findByIdAndUpdate(
        pId,
        {
          $set: {
            pRatings: avgRating,
            pNumOfReviews: newRatingReview.pRatingsReviews.length,
          },
        }
      );
  
      return res.json({ success: "Thanks for your review" });
    } catch (err) {
      console.error(err);
      return res.json({ error: "Something went wrong" });
    }
  }
  
  async deleteReview(req, res) {
    try {
      const { rId, pId } = req.body;
  
      if (!rId) {
        return res.json({ message: "All fields must be required" });
      }
  
      const reviewDelete = await productModel.findByIdAndUpdate(
        pId,
        { $pull: { pRatingsReviews: { _id: rId } } },
        { new: true }
      );
  
      const avgRating = reviewDelete.pRatingsReviews.reduce((acc, item) => item.rating + acc, 0) / reviewDelete.pRatingsReviews.length;
  
      await productModel.findByIdAndUpdate(
        pId,
        {
          $set: {
            pRatings: avgRating,
            pNumOfReviews: reviewDelete.pRatingsReviews.length,
          },
        }
      );
  
      return res.json({ success: "Your review is deleted" });
    } catch (err) {
      console.error(err);
      return res.json({ error: "Something went wrong" });
    }
  }
  
}

const productController = new Product();
module.exports = productController;
