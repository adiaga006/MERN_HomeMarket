import axios from "axios";
const apiURL = process.env.REACT_APP_API_URL;

const BearerToken = () =>
  localStorage.getItem("jwt")
    ? JSON.parse(localStorage.getItem("jwt")).token
    : false;
const Headers = () => {
  return {
    headers: {
      token: `Bearer ${BearerToken()}`,
    },
  };
};

export const getBrainTreeToken = async () => {
  let uId = JSON.parse(localStorage.getItem("jwt")).user._id;
  try {
    let res = await axios.post(`${apiURL}/api/braintree/get-token`, {
      uId: uId,
    });
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const getPaymentProcess = async (paymentData) => {
  try {
    let res = await axios.post(`${apiURL}/api/braintree/payment`, paymentData);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const createOrder = async (orderData, allDiscount) => {
  try {
    let res = await axios.post(`${apiURL}/api/order/create-order`, orderData);
    if (allDiscount != null) {
    allDiscount.forEach(discount => {
      if (discount.user !== null) {
        editDiscount(
          discount.id,
          discount.name,
          discount.method,
          discount.amount,
          discount.percent,
          discount.category,
          "No",
          discount.user,
          "Active"
        )
      }
    }
    )};
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const editDiscount = async (dId, name, method, amount, percent, category, apply, user, status) => {
  let data = { dId: dId, dName: name, dMethod: method, dAmount: amount, dPercent: percent, dCategory: category, dApply: apply, dUser: user, dStatus: status };
  try {
    let res = await axios.post(
      `${apiURL}/api/discount/edit-discount`,
      data,
      Headers()
    );
    return res.data;
  } catch (error) {
    console.log(error);
  }
};
