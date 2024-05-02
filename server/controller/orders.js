const orderModel = require("../models/orders");
const productModel=require("../models/products");
const discountModel=require("../models/discounts");
class Order {
  async getAllOrders(req, res) {
    try {
      let Orders = await orderModel
        .find({})
        .populate("allProduct.id", "pName pImages pPrice pOffer pQuantity")
        .populate("allDiscount.id", "_id dName dMethod dAmount dPercent dApply dCategory")
        .populate("user", "name email")
        .sort({ _id: -1 });
      if (Orders) {
        return res.json({ Orders });
      }
    } catch (err) {
      console.log(err);
    }
  }

  async getOrderByUser(req, res) {
    let { uId } = req.body;
    if (!uId) {
      return res.json({ message: "All filled must be required" });
    } else {
      try {
        let Order = await orderModel
          .find({ user: uId })
          .populate("allProduct.id", "pName pImages pPrice")
          .populate("user", "name email")
          .sort({ _id: -1 });
        if (Order) {
          return res.json({ Order });
        }
      } catch (err) {
        console.log(err);
      }
    }
  }

  async postCreateOrder(req, res) {
    let { allProduct, user, amount, transactionId, address, phone, allDiscount} = req.body;
  
    if (!allProduct || !user || !amount || !transactionId || !address || !phone ) {
      return res.json({ message: "All fields must be required" });
      
    } else {
      try {
        const outOfStockProducts = [];
        // Kiểm tra số lượng sản phẩm trong kho trước khi tạo đơn hàng
        for (const productInfo of allProduct) {
          const { id, quantitiy } = productInfo;
      
          try {
            // Lấy thông tin sản phẩm
            const product = await productModel.findById(id);
            const name = product.pName;
      
            // Kiểm tra số lượng sản phẩm còn đủ hay không
            if (!product || product.pQuantity < quantitiy) {
              outOfStockProducts.push(name);
            }
          } catch (error) {
            return res.json({
              error: error.message || "Failed to check product quantity",
            });
          }
        }
      
        // Nếu có sản phẩm hết hàng, trả về thông báo lỗi
        if (outOfStockProducts.length > 0) {
          return res.json({
            error: `Not enough quantity available for the following products: ${outOfStockProducts.join(", ")}. Please remove those products from the cart and purchase other products`,
          });
        }
        // Tạo mới đơn hàng và cập nhật số lượng sản phẩm trong kho
        let newOrder = new orderModel({
          allProduct,
          user,
          amount,
          transactionId,
          address,
          phone,
          allDiscount
        });
  
        for (const productInfo of allProduct) {
          const { id, quantitiy } = productInfo;
  
          try {
            // Tìm sản phẩm theo ID và cập nhật số lượng
            const updatedProduct = await productModel.findByIdAndUpdate(
              id,
              { $inc: { pQuantity: -quantitiy, pSold: quantitiy } },
              { new: true }
            );
  
            if (!updatedProduct) {
              return res.json({ error: "Product not found" });
            }
          } catch (error) {
            return res.json({
              error: error.message || "Failed to update product quantity",
            });
          }
        }
  
        let save = await newOrder.save();
        if (save) {
          return res.json({ success: "Order created successfully" });
        }
      } catch (err) {
        return res.json({ error: err.message || "Failed to create order" });
      }
    }
  }  

  async postUpdateOrder(req, res) {
    let { oId, status } = req.body;
    if (!oId || !status) {
      return res.json({ message: "All filled must be required" });
    } else {
      let currentOrder = orderModel.findByIdAndUpdate(oId, {
        status: status,
        updatedAt: Date.now(),
      });
      currentOrder.exec((err, result) => {
        if (err) console.log(err);
        return res.json({ success: "Order updated successfully" });
      });
    }
  }

  async postDeleteOrder(req, res) {
    let { oId } = req.body;
    if (!oId) {
      return res.json({ error: "All filled must be required" });
    } else {
      try {
        let deleteOrder = await orderModel.findByIdAndDelete(oId);
        if (deleteOrder) {
          return res.json({ success: "Order deleted successfully" });
        }
      } catch (error) {
        console.log(error);
      }
    }
  }
}

const ordersController = new Order();
module.exports = ordersController;
