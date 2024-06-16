import { getAllOrder } from "../../admin/orders/FetchApi";
import { getAllDiscount_Admin } from "../../admin/discounts/FetchApi";
import { addToCart } from "./Mixins"
import { Alert } from "react-bootstrap";

export const logout = () => {
  localStorage.removeItem("jwt");
  localStorage.removeItem("cart");
  localStorage.removeItem("wishList");
  window.location.href = "/";
};

export const addDiscount = async ({
  dName,
  setError
}) => {
  try {
    let responseData = await getAllDiscount_Admin();
    let checkDiscount;
    let checkOrderDiscount;
    let carts = JSON.parse(localStorage.getItem("cart"));
    let discounts = JSON.parse(localStorage.getItem("discount"));

    if (responseData && responseData.Discounts) {
      if (dName) {
        checkDiscount = responseData.Discounts.filter(
          (item) => item.dName === (dName)
        );
        if (checkDiscount.length > 0) {
          for (const discount of checkDiscount) {
            // Kiem tra discount con su dung duoc khong
            if (discount.dApply === "Yes") {
              // Kiem tra discount đã được user xài qua chưa
              let responseOrderData = await getAllOrder();
              checkOrderDiscount = responseOrderData.Orders.filter(
                (item) => item.user._id === (JSON.parse(localStorage.getItem("jwt")).user._id)
              );
              if (checkOrderDiscount.length > 0) {
                for (const order of checkOrderDiscount) {
                  if (order.allDiscount != null) {
                    for (const orderDiscount of order.allDiscount) {
                      if (orderDiscount.id._id === discount._id) {
                        setError("Users have used this discount before")
                        return false;
                      }
                    }
                  }
                }
                if (discounts != null) {
                  discounts.forEach((dis) => {
                    if (dis.id === discount._id) {
                      setError("Discount was applied successfully")
                      return false;
                    }
                  });
                }
                let discountApplied = false;
                // Kiem tra xem co san pham nao trong cart ap dung duoc discount khong
                carts.forEach((item) => {
                  if (item.category._id === discount.dCategory._id) {
                    addToCart(discount._id, discount.dCategory._id, discount.dMethod, discount.dAmount, discount.dPercent)
                    discountApplied = true;
                    return true;
                  }
                });
                if (!discountApplied) {
                  setError("There are no products in the cart that can be discounted")
                  return false;
                }
              }
              else {
                addToCart(discount._id, discount.dCategory._id, discount.dMethod, discount.dAmount, discount.dPercent)
                return true;
              }
            } else {
              setError("Discount expires")
              return false;
            }
          }
        } else {
          setError("Discount does not exist")
          return false;
        }
      } else {
        setError("There is no discount")
        return false;
      }
    }
  } catch (error) {
    console.log(error);
  }
};

