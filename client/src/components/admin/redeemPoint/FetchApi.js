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

export const getAllRedeemPoint = async () => {
  try {
    let res = await axios.get(`${apiURL}/api/redeem/all-redeem`, Headers());
    return res.data;
  } catch (error) {
    console.log(error);
  }
};
export const getAllRedeemPoint_Admin = async () => {
  try {
    let res = await axios.get(`${apiURL}/api/redeem/all-redeem-admin`, Headers());
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const createRedeemPoint = async ({
  rPoint,
  rMethod,
  rAmount,
  rPercent,
  rCategory,
  rApply,
  rStatus
}) => {
  try {
    let res = await axios.post(
      `${apiURL}/api/redeem/add-redeem`,
      {
        rPoint,
        rMethod,
        rAmount,
        rPercent,
        rCategory,
        rApply,
        rStatus
      },
      {
        ...Headers(),
        'content-type': 'application/json'
      }
    );
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const editRedeemPoint = async (rId, point, method, amount, percent, category, apply, status) => {
  let data = { rId: rId, rPoint: point, rMethod: method, rAmount: amount, rPercent: percent, rCategory: category, rApply: apply, rStatus: status };
  try {
    let res = await axios.post(
      `${apiURL}/api/redeem/edit-redeem`,
      data,
      Headers()
    );
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const deleteRedeemPoint = async (rId) => {
  try {
    let res = await axios.post(
      `${apiURL}/api/redeem/delete-redeem`,
      { rId },
      Headers()
    );
    console.log(res.data);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};
