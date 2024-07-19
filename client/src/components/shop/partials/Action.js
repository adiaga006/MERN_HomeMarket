import { getAllOrder } from "../../admin/orders/FetchApi";
import { getAllDiscount_Admin } from "../../admin/discounts/FetchApi";
import { addToCart } from "./Mixins";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Initialize React Toastify
toast.configure();

export const logout = () => {
  localStorage.removeItem("jwt");
  localStorage.removeItem("cart");
  localStorage.removeItem("wishList");
  window.location.href = "/";
};

export const addDiscount = async ({ dName }) => {
  try {
    let responseData = await getAllDiscount_Admin();
    let checkDiscount;
    let checkOrderDiscount;
    let carts = JSON.parse(localStorage.getItem("cart"));
    let discounts = JSON.parse(localStorage.getItem("discount"));

    if (responseData && responseData.Discounts) {
      if (dName) {
        checkDiscount = responseData.Discounts.filter(
          (item) => item.dName === dName
        );
        if (checkDiscount.length > 0) {
          for (const discount of checkDiscount) {
            // Check if discount is still applicable
            if (discount.dApply === "Yes") {
              // Check if the user has used the discount before
              let responseOrderData = await getAllOrder();
              checkOrderDiscount = responseOrderData.Orders.filter(
                (item) =>
                  item.user._id === JSON.parse(localStorage.getItem("jwt")).user._id
              );
              if (checkOrderDiscount.length > 0) {
                for (const order of checkOrderDiscount) {
                  if (order.allDiscount != null) {
                    for (const orderDiscount of order.allDiscount) {
                      if (orderDiscount.id._id === discount._id) {
                        toast.error("Người dùng đã sử dụng giảm giá này trước đây");
                        return false;
                      }
                    }
                  }
                }
                if (discounts != null) {
                  discounts.forEach((dis) => {
                    if (dis.id === discount._id) {
                      return false;
                    }
                  });
                }
                let discountApplied = false;
                // Check if there are any products in the cart that can be discounted
                carts.forEach((item) => {
                  if (item.category._id === discount.dCategory._id) {
                    addToCart(
                      discount._id,
                      discount.dName,
                      discount.dCategory._id,
                      discount.dMethod,
                      discount.dAmount,
                      discount.dPercent,
                      discount.dUser
                    );
                    discountApplied = true;
                    toast.success("Mã giảm giá đã được áp dụng thành công");
                    return true;
                  }
                });
                if (!discountApplied) {
                  toast.error("Không có sản phẩm nào trong giỏ hàng có thể giảm giá");
                  return false;
                }
              } else {
                addToCart(
                  discount._id,
                  discount.dName,
                  discount.dCategory._id,
                  discount.dMethod,
                  discount.dAmount,
                  discount.dPercent,
                  discount.dUser
                );
                return true;
              }
            } else {
              toast.error("Mã khuyến mãi hết hạn");
              return false;
            }
          }
        } else {
          toast.error("Mã khuyến mãi không hợp lệ");
          return false;
        }
      } else {
        toast.error("Không có mã khuyến mãi nào được sử dụng");
        return false;
      }
    }
  } catch (error) {
    console.log(error);
  }
};
