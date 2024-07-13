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

export const getAllDiscount = async () => {
  try {
    let res = await axios.get(`${apiURL}/api/discount/all-discount`, Headers());
    return res.data;
  } catch (error) {
    console.log(error);
  }
};
export const getAllDiscount_Admin = async () => {
  try {
    let res = await axios.get(`${apiURL}/api/discount/all-discount-admin`, Headers());
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const createDiscount = async ({
  dName,
  dMethod,
  dAmount,
  dPercent,
  dCategory,
  dApply,
  dStatus
}) => {
  try {
    let dUser = null;
    let res = await axios.post(
      `${apiURL}/api/discount/add-discount`,
      {
        dName,
        dMethod,
        dAmount,
        dPercent,
        dCategory,
        dApply,
        dUser,
        dStatus
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

export const editDiscount = async (dId, name, method, amount, percent, category, apply, status) => {
  let data = { dId: dId, dName: name, dMethod: method, dAmount: amount, dPercent: percent, dCategory: category, dApply: apply, dUser: null, dStatus: status };
  try {
    let res = await axios.post(
      `${apiURL}/api/discount/edit-discount`,
      data,
      Headers()
    );
    console.log(res.data);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const deleteDiscount = async (dId) => {
  try {
    let res = await axios.post(
      `${apiURL}/api/discount/delete-discount`,
      { dId },
      Headers()
    );
    return res.data;
  } catch (error) {
    console.log(error);
  }
};
