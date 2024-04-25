import axios from "axios";
const apiURL = process.env.REACT_APP_API_URL;

export const isAuthenticate = () =>
  localStorage.getItem("jwt") ? JSON.parse(localStorage.getItem("jwt")) : false;

export const isAdmin = () =>
  localStorage.getItem("jwt")
    ? JSON.parse(localStorage.getItem("jwt")).user.role === 1
    : false;

export const loginReq = async ({ email, password }) => {
  const data = { email, password };
  try {
    let res = await axios.post(`${apiURL}/api/signin`, data);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const signupReq = async ({ name, email, password, cPassword }) => {
  const data = { name, email, password, cPassword };
  try {
    let res = await axios.post(`${apiURL}/api/signup`, data);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const confirmSignupReq = async ({ email, otp }) => {
  const data = { email, otp };
  try {
    let res = await axios.post(`${apiURL}/api/confirm_signup`, data);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};
//${apiURL}/api/confirm_signup

export const resetPasswordAfterOtp = async (email, otp, newPassword) => {
  const data = { email, otp, newPassword };

  try {
    let res = await axios.post(`${apiURL}/api/ResetPass`, data);
    return res.data;
  } catch (error) {
    console.error(error);
  }
};
export const sendOtpForResetPassword = async (email) => {
  const data = { email };
  try {
    let response = await axios.post(`${apiURL}/api/OtpResetPass`, data);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};
