
import {
  getUserById,
  updatePersonalInformationFetch,
  getOrderByUser,
  updatePassword,
  getDiscountByUser,
} from "./FetchApi";

import { getAllOrder } from "../../admin/orders/FetchApi";
import axios from "axios";
const apiURL = process.env.REACT_APP_API_URL;

export const logout = () => {
  localStorage.removeItem("jwt");
  localStorage.removeItem("cart");
  localStorage.removeItem("wishList");
  window.location.href = "/";
};

export const fetchData = async (dispatch) => {
  dispatch({ type: "loading", payload: true });
  let userId = JSON.parse(localStorage.getItem("jwt"))
    ? JSON.parse(localStorage.getItem("jwt")).user._id
    : "";
  try {
    let responseData = await getUserById(userId);
    setTimeout(() => {
      if (responseData && responseData.User) {
        dispatch({ type: "userDetails", payload: responseData.User });
        dispatch({ type: "loading", payload: false });
      }
    }, 500);
  } catch (error) {
    console.log(error);
  }
};

export const fetchOrderByUser = async (dispatch) => {
  dispatch({ type: "loading", payload: true });
  let userId = JSON.parse(localStorage.getItem("jwt"))
    ? JSON.parse(localStorage.getItem("jwt")).user._id
    : "";
  try {
    let responseData = await getOrderByUser(userId);
    setTimeout(() => {
      if (responseData && responseData.Order) {
        dispatch({ type: "OrderByUser", payload: responseData.Order });
        dispatch({ type: "loading", payload: false });
      }
    }, 500);
  } catch (error) {
    console.log(error);
  }
};

export const fetchDiscountByUser = async (dispatch) => {
  dispatch({ type: "loading", payload: true });
  let userId = JSON.parse(localStorage.getItem("jwt"))
    ? JSON.parse(localStorage.getItem("jwt")).user._id
    : "";
  try {
    // Lấy danh sách các discount từ getDiscountByUser
    let responseData = await getDiscountByUser();

    // Lấy danh sách các order từ getAllOrder
    let responseOrderData = await getAllOrder();

    // Lấy danh sách discount chưa hêt hạn
    let discountNotExpires = responseData.Discounts.filter(discount => discount.dApply === "Yes")
    // Lọc các order của user và có discount
    let checkOrderDiscount = responseOrderData.Orders.filter((item) =>
      item.user._id === userId && item.allDiscount && item.allDiscount.length > 0
    );

    // Lấy danh sách các discount ID trong các order của user
    let discountIdsInOrders = checkOrderDiscount.flatMap(order => order.allDiscount.map(discount => discount.id._id));

    // Lọc các discount chưa dùng từ việc loại các discount đã sử dụng
    let discountNotUse = discountNotExpires.filter((discount) =>
      !discountIdsInOrders.includes(discount._id)
    );
    setTimeout(() => {
      if (responseData && responseData.Discounts) {
        dispatch({ type: "DiscountByUser", payload: discountNotUse });
        dispatch({ type: "loading", payload: false });
      }
    }, 500);
  } catch (error) {
    console.log(error);
  }
};

export const updatePersonalInformationAction = async (dispatch, user) => {
  let formData = new FormData();
  if (user.editAvatar) {
    formData.append("editAvatar", user.editAvatar)
  }
  formData.append("uId", user.id);
  formData.append("name", user.name);
  if (user.phone) {
    formData.append("phoneNumber", user.phone);
  }

  dispatch({ type: "loading", payload: true });
  try {
    let responseData = await updatePersonalInformationFetch(formData);
    setTimeout(() => {
      if (responseData && responseData.success) {
        dispatch({ type: "loading", payload: false });
        fetchData(dispatch);
      }
    }, 500);
  } catch (error) {
    console.log(error);
  }
};

export const handleChangePassword = async (fData, setFdata, dispatch) => {
  if (!fData.newPassword || !fData.oldPassword || !fData.confirmPassword) {
    setFdata({
      ...fData,
      error: "Please provide your all password and a new password",
    });
  } else if (fData.newPassword !== fData.confirmPassword) {
    setFdata({ ...fData, error: "Password does't match" });
  } else {
    const formData = {
      uId: JSON.parse(localStorage.getItem("jwt")).user._id,
      oldPassword: fData.oldPassword,
      newPassword: fData.newPassword,
    };
    dispatch({ type: "loading", payload: true });
    try {
      let responseData = await updatePassword(formData);
      if (responseData && responseData.success) {
        setFdata({
          ...fData,
          success: responseData.success,
          error: "",
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        dispatch({ type: "loading", payload: false });
      } else if (responseData.error) {
        dispatch({ type: "loading", payload: false });
        setFdata({
          ...fData,
          error: responseData.error,
          success: "",
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      }
    } catch (error) {
      console.log(error);
    }
  }
};