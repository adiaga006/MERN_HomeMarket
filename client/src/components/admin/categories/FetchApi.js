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

export const getAllCategory = async () => {
  try {
    let res = await axios.get(`${apiURL}/api/category/all-category`, Headers());
    return res.data;
  } catch (error) {
    console.log(error);
  }
};
export const getAllCategory_Admin = async () => {
  try {
    let res = await axios.get(`${apiURL}/api/category/all-category-admin`, Headers());
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const createCategory = async ({
  cName,
  cDescription,
  cStatus,
  cParentCategory
}) => {
  try {
    console.log(cName);
    console.log(cDescription);
    // console.log(cParentCategory);
    console.log(cStatus);
    if (cParentCategory === "") {
      cParentCategory = undefined;
    }
    let res = await axios.post(
      `${apiURL}/api/category/add-category`,
      {
        cName,
        cDescription,
        cStatus,
        cParentCategory
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

export const editCategory = async (cId, name, des, parent, status) => {
  let data = { cId: cId, cName: name, cDescription: des, cParentCategory: parent , cStatus: status };
  try {
    let res = await axios.post(
      `${apiURL}/api/category/edit-category`,
      data,
      Headers()
    );
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const deleteCategory = async (cId) => {
  try {
    let res = await axios.post(
      `${apiURL}/api/category/delete-category`,
      { cId },
      Headers()
    );
    return res.data;
  } catch (error) {
    console.log(error);
  }
};
