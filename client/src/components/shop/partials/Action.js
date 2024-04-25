import { getAllOrder } from "F:/MERN_HomeMarket/client/src/components/admin/orders/FetchApi";
import { getAllDiscount_Admin } from "F:/MERN_HomeMarket/client/src/components/admin/discounts/FetchApi";
import { addToCart } from "./Mixins"

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
                  for (const orderDiscount of order.allDiscount) {
                    if (orderDiscount.id._id === discount._id) {
                      setError("Nguoi dung da tung su dung discount nay")
                      return false;
                    }
                  }
                }
                discounts.forEach((dis) => {
                  console.log(dis.id)
                  console.log(discount._id);
                  if (dis.id === discount._id) {
                    setError("Discount da duoc ap dung vao product")
                    return false;
                  }
                });
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
                  setError("Trong cart khong co san pham ap dung duoc discount")
                  return false;
                }
              }
              else {
                addToCart(discount._id, discount.dCategory._id, discount.dMethod, discount.dAmount, discount.dPercent)
                return true;
              }
            } else {
              setError("Discount het han su dung")
              return false;
            }
          }
        } else {
          setError("Discount khong ton tai")
          return false;
        }
      } else {
        setError("Khong co discount")
        return false;
      }
    }
  } catch (error) {
    console.log(error);
  }
};

