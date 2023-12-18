import axios from "axios";
const apiURL = process.env.REACT_APP_API_URL;

export const getAllOrder = async () => {
  try {
    let res = await axios.get(`${apiURL}/api/user/all-user`);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const editCategory = async (uId, role) => {
  let data = { uId: uId, role: role };
  console.log(data);
  try {
    let res = await axios.post(`${apiURL}/api/user/admin-edit-user`, data);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const deleteOrder = async (uId) => {
  let data = { uId: uId };
  try {
    let res = await axios.post(`${apiURL}/api/user/delete-user`, data);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};
