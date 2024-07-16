import axios from "axios";
const apiURL = process.env.REACT_APP_API_URL;

export const getAllUser = async () => {
  try {
    let res = await axios.get(`${apiURL}/api/user/all-user`);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const getAllOrder = async () => {
  try {
    let res = await axios.get(`${apiURL}/api/order/get-all-orders`);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const editCategory = async (oId, shipper, status) => {
  let data = { oId: oId, shipper: shipper, status: status };
  console.log(data);
  try {
    let res = await axios.post(`${apiURL}/api/order/update-order`, data);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const deleteOrder = async (oId) => {
  let data = { oId: oId };
  try {
    let res = await axios.post(`${apiURL}/api/order/delete-order`, data);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};
