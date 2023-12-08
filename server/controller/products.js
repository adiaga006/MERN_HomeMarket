const productModel = require("../models/products");
const fs = require("fs");
const path = require("path");
const cloudinary = require('cloudinary')

async function deleteCloudinaryImages(images) {
  try {
    for (const image of images) {
      await cloudinary.uploader.destroy(image.public_id);
    }
    console.log('All images deleted successfully.');
  } catch (error) {
    console.error('Error deleting images from Cloudinary:', error);
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
        .find({ pStatus: { $in: ["Active", "Disabled","Not available"] } })
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
      Product.deleteImages(images, "file");
      return res.json({ error: "All fields must be required" });
    } else if (pName.length > 255 || pDescription.length > 3000) {
      Product.deleteImages(images, "file");
      return res.json({
        error: "Name 255 & Description must not be 3000 characters long",
      });
    } else if (images.length < 1) {
      Product.deleteImages(images, "file");
      return res.json({ error: "Need at least 1 images" });
    } else if (isNaN(pQuantity) || pQuantity < 0) {
      Product.deleteImages(images, "file");
      return res.json({ error: "Quantity must be a non-negative number" });
    } else {
      try {
        pName=pName.trimEnd();
        // Kiểm tra trùng tên
        const existingProduct = await productModel.findOne({
          pName: { $regex: new RegExp("^" + pName + "$", "i") } });
        if (existingProduct) {
          Product.deleteImages(images, "file");
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
      return res.json({ error: "Name 255 & Description must not be 3000 characters long" });
    } 
    // else if (editImages && editImages.length == 1) {
    //   Product.deleteImages(editImages, "file");
    //   return res.json({ error: "Must need to provide at least 1 image" });
    // } else {
    const editImages = req.files;
    const existingImages = [];

    // if (editImages.length == 2) {
    //   let allEditImages = [];
    //   for (const img of editImages) {
    //     allEditImages.push(img.filename);
    //   }
    //   editData = { ...editData, pImages: allEditImages };
    //   Product.deleteImages(pImages.split(","), "string");
    // }

    try {
      // pName=pName.trimEnd();
      // // Kiểm tra trùng tên (ngoại trừ sản phẩm đang cập nhật)
      // const existingProduct = await productModel.findOne({ 
      //   pName: { $regex: new RegExp("^" + pName + "$", "i") }, _id: { $ne: pId } });
      // if (existingProduct) {
      //   return res.json({ error: "Product with the same name already exists" });
      // }
      
      const product = await productModel.findById(pId);

      if (editImages) {
        for (const image of editImages) {
          const result = await cloudinary.v2.uploader.upload(image.path, { folder: 'products' });
          existingImages.push({ public_id: result.public_id, url: result.secure_url });
        }
      }

      if (product.pImages) {
        for (let i = 0; i < product.pImages.length; i++) {
          await cloudinary.v2.uploader.destroy(product.pImages[i].public_id);
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

      let editProduct = productModel.findByIdAndUpdate(pId, editData);
      editProduct.exec((err) => {
        if (err) console.log(err);
        return res.json({ success: "Product edited successfully" });
      });

    } catch (err) {
      console.log(err);
      return res.json({ error: "An error occurred while editing the product" });
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
            pQuantity: 0,
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
          .find({ pPrice: { $lte: price } , pStatus: "Active"})
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
    let { pId, uId, rating, review } = req.body;
    if (!pId || !rating || !review || !uId) {
      return res.json({ error: "All filled must be required" });
    } else {
      let checkReviewRatingExists = await productModel.findOne({ _id: pId });
      if (checkReviewRatingExists.pRatingsReviews.length > 0) {
        checkReviewRatingExists.pRatingsReviews.map((item) => {
          if (item.user === uId) {
            return res.json({ error: "Your already reviewd the product" });
          } else {
            try {
              let newRatingReview = productModel.findByIdAndUpdate(pId, {
                $push: {
                  pRatingsReviews: {
                    review: review,
                    user: uId,
                    rating: rating,
                  },
                },
              });
              newRatingReview.exec((err, result) => {
                if (err) {
                  console.log(err);
                }
                return res.json({ success: "Thanks for your review" });
              });
            } catch (err) {
              return res.json({ error: "Cart product wrong" });
            }
          }
        });
      } else {
        try {
          let newRatingReview = productModel.findByIdAndUpdate(pId, {
            $push: {
              pRatingsReviews: { review: review, user: uId, rating: rating },
            },
          });
          newRatingReview.exec((err, result) => {
            if (err) {
              console.log(err);
            }
            return res.json({ success: "Thanks for your review" });
          });
        } catch (err) {
          return res.json({ error: "Cart product wrong" });
        }
      }
    }
  }

  async deleteReview(req, res) {
    let { rId, pId } = req.body;
    if (!rId) {
      return res.json({ message: "All filled must be required" });
    } else {
      try {
        let reviewDelete = productModel.findByIdAndUpdate(pId, {
          $pull: { pRatingsReviews: { _id: rId } },
        });
        reviewDelete.exec((err, result) => {
          if (err) {
            console.log(err);
          }
          return res.json({ success: "Your review is deleted" });
        });
      } catch (err) {
        console.log(err);
      }
    }
  }
}

const productController = new Product();
module.exports = productController;
