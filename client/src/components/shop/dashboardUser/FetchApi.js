import axios from "axios";
const apiURL = process.env.REACT_APP_API_URL;

export const getUserById = async (uId) => {
  try {
    let res = await axios.post(`${apiURL}/api/user/signle-user`, { uId });
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const updatePersonalInformationFetch = async (formData) => {
  try {
    let res = await axios.post(`${apiURL}/api/user/edit-user`, formData);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const getOrderByUser = async (uId) => {
  try {
    let res = await axios.post(`${apiURL}/api/order/order-by-user`, { uId });
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const getDiscountByUser = async () => {
  try {
    let res = await axios.get(`${apiURL}/api/discount/all-discount`);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const getAllRedeemPoint = async () => {
  try {
    let res = await axios.get(`${apiURL}/api/redeem/all-redeem`);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const getTotalPoint = async (uId) => {
  try {
    let res = await axios.post(`${apiURL}/api/order/order-by-user`, { uId });
    let filterOrder = res.data.Order.filter(item => item.status === "Delivered")
    let totalAmount = 0
    for (const order of filterOrder) {
      for (const product of order.allProduct) {
        totalAmount += product.quantitiy * (product.oldPrice * (1 - product.offer/100));
      }
    }
    let totalPoint = Math.round(totalAmount / 10);
    return totalPoint;
  } catch (error) {
    console.log(error);
  }
};

export const updatePassword = async (formData) => {
  try {
    let res = await axios.post(`${apiURL}/api/user/change-password`, formData);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};