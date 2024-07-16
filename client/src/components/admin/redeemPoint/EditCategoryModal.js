import React, { Fragment, useContext, useState, useEffect } from "react";
import { CategoryContext } from "./index";
import { editRedeemPoint, getAllRedeemPoint_Admin } from "./FetchApi";
import { getAllCategory } from "../categories/FetchApi";

const EditCategoryModal = (props) => {
  const { data, dispatch } = useContext(CategoryContext);

  const [rId, setrId] = useState("");
  const [point, setPoint] = useState(0);
  const [method, setMethod] = useState("");
  const [amount, setAmount] = useState(0);
  const [percent, setPercent] = useState(0);
  const [category, setCategory] = useState("");
  const [apply, setApply] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [categories, setCategories] = useState(null);


  useEffect(() => {
    setrId(data.editCategoryModal.rId);
    setPoint(data.editCategoryModal.point); // Add this line
    setMethod(data.editCategoryModal.method);
    setAmount(data.editCategoryModal.amount);
    setPercent(data.editCategoryModal.percent);
    setCategory(data.editCategoryModal.category);
    setApply(data.editCategoryModal.apply);
    setStatus(data.editCategoryModal.status);
    setError(""); // Clear error when modal is opened
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.editCategoryModal.modal]);

  const handleMethodChange = (e) => {
    const selectedMethod = e.target.value;
    setMethod(selectedMethod);
    // Nếu phương thức được chọn là "Amount", đặt giá trị percent thành 0
    if (selectedMethod === "Amount") {
      setPercent(0);
    }
    // Nếu phương thức được chọn là "Percent", đặt giá trị amount thành 0
    if (selectedMethod === "Percent") {
      setAmount(0);
    }
  };

  useEffect(() => {
    fetchCategoryData();
  }, []);

  const fetchData = async () => {
    let responseData = await getAllRedeemPoint_Admin();
    if (responseData.redeemPoints) {
      dispatch({
        type: "fetchCategoryAndChangeState",
        payload: responseData.redeemPoints,
      });
    }
  };
  
  const fetchCategoryData = async () => {
    let responseData = await getAllCategory();
    if (responseData.Categories) {
      setCategories(responseData.Categories.filter(category => category.cParentCategory !== null).reverse());
    }
  };

  const submitForm = async () => {
    // dispatch({ type: "loading", payload: true });
    let edit = await editRedeemPoint(rId, point, method, amount, percent, category, apply, status);
    if (edit.error) {
      setError(edit.error);
      dispatch({ type: "loading", payload: false });
    } 
    else if (edit.success) {
      console.log(edit.success);
      dispatch({ type: "editCategoryModalClose" });
      setTimeout(() => {
        fetchData();
        dispatch({ type: "loading", payload: false });
      }, 1000);
    }
  };

  return (
    <Fragment>
      {/* Black Overlay */}
      <div
        onClick={(e) => dispatch({ type: "editCategoryModalClose" })}
        className={`${data.editCategoryModal.modal ? "" : "hidden"
          } fixed top-0 left-0 z-30 w-full h-full bg-black opacity-50`}
      />
      {/* End Black Overlay */}

      {/* Modal Start */}
      <div
        className={`${data.editCategoryModal.modal ? "" : "hidden"
          } fixed inset-0 m-4  flex items-center z-30 justify-center`}
      >
        <div className="relative bg-white w-11/12 md:w-3/6 shadow-lg flex flex-col items-center space-y-4  overflow-y-auto px-4 py-4 md:px-8">
          <div className="flex items-center justify-between w-full pt-4">
            <span className="text-left font-semibold text-2xl tracking-wider">
              Chỉnh Sửa Đổi Thưởng
            </span>
            {/* Close Modal */}
            <span
              style={{ background: "#303031" }}
              onClick={(e) => dispatch({ type: "editCategoryModalClose" })}
              className="cursor-pointer text-gray-100 py-2 px-2 rounded-full"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </span>
          </div>
          {/* Display error */}
          {error && (
            <div className="text-red-500 text-sm">
              <span>Error: {error}</span>
            </div>
          )}
          <form className="w-full">
            <div className="flex flex-col space-y-1 w-full">
              <label htmlFor="name">Điểm *</label>
              <input
                type="text"
                value={point}
                onChange={(e) => setPoint(e.target.value)}
                className="px-4 py-2 border focus:outline-none"
                name="name"
                id="name"
              />
            </div>
            <div className="flex flex-col space-y-1 w-full">
              <label htmlFor="method">Phương thức *</label>
              <select
                value={method}
                name="method"
                onChange={handleMethodChange}
                className="px-4 py-2 border focus:outline-none"
                id="method"
              >
                <option name="method" value="Amount">
                  Amount
                </option>
                <option name="method" value="Percent">
                  Percent
                </option>
              </select>
            </div>
            <div className="flex space-x-1 py-4">
              <div className="w-1/2 flex flex-col space-y-1 space-x-1">
                <label htmlFor="amount">Giá tiền *</label>
                <input
                  type="text"
                  value={amount}
                  onChange={(e) => {
                    const inputAmount = e.target.value;
                    let newAmount = inputAmount;

                    // Kiểm tra nếu giá trị nhập vào là nhỏ hơn 0, đặt thành 0
                    if (inputAmount < 0) {
                      newAmount = 0;
                    }

                    setAmount(newAmount)
                  }}
                  className="px-4 py-2 border focus:outline-none"
                  name="amount"
                  id="amount"
                  disabled={method === "Percent"}
                />
              </div>
              <div className="w-1/2 flex flex-col space-y-1 space-x-1">
                <label htmlFor="percent">Phần trăm *</label>
                <input
                  type="text"
                  value={percent}
                  onChange={(e) => {
                    const inputPercent = e.target.value;
                    let newPercent = inputPercent;

                    // Kiểm tra nếu giá trị nhập vào là nhỏ hơn 0, đặt thành 0
                    if (inputPercent < 0 || inputPercent > 100) {
                      newPercent = 0;
                    }
                    setPercent(newPercent)
                  }}
                  className="px-4 py-2 border focus:outline-none"
                  name="percent"
                  id="percent"
                  disabled={method === "Amount"}
                />
              </div>
            </div>
            <div className="flex space-x-1 py-4">
              <div className="w-1/2 flex flex-col space-y-1">
                <label htmlFor="discount">Danh mục *</label>
                <select
                  onChange={(e) => setCategory(e.target.value)}
                  name="discount"
                  className="px-4 py-2 border focus:outline-none"
                  id="discount"
                >
                  <option disabled value="">
                    Chọn danh mục
                  </option>
                  {categories && categories.length > 0
                    ? categories.map((elem) => {
                      return (
                        <Fragment key={elem._id}>
                          {category._id && category._id &&
                            category._id === elem._id ? (
                            <option
                              name="status"
                              value={elem._id}
                              key={elem._id}
                              selected
                            >
                              {elem.cName}
                            </option>
                          ) : (
                            <option
                              name="status"
                              value={elem._id}
                              key={elem._id}
                            >
                              {elem.cName}
                            </option>
                          )}
                        </Fragment>
                      );
                    })
                    : ""}
                </select>
              </div>
              <div className="w-1/2 flex flex-col space-y-1">
                <label htmlFor="apply">Áp dụng *</label>
                <select
                  value={apply}
                  name="apply"
                  onChange={(e) => setApply(e.target.value)}
                  className="px-4 py-2 border focus:outline-none"
                  id="apply"
                >
                  <option name="apply" value="Yes">
                    Yes
                  </option>
                  <option name="apply" value="No">
                    No
                  </option>
                </select>
              </div>
            </div>
            <div className="flex flex-col space-y-1 w-full">
              <label htmlFor="status">Trạng thái *</label>
              <select
                value={status}
                name="status"
                onChange={(e) => setStatus(e.target.value)}
                className="px-4 py-2 border focus:outline-none"
                id="status"
              >
                <option name="status" value="Active">
                  Active
                </option>
                <option name="status" value="Disabled">
                  Disabled
                </option>
              </select>
            </div>
            <div className="flex flex-col space-y-1 w-full pb-4 md:pb-6 mt-4">
              <button
                style={{ background: "#303031" }}
                onClick={(e) => submitForm()}
                className="rounded-full bg-gray-800 text-gray-100 text-lg font-medium py-2"
              >
                Cập Nhật Đổi Thưởng
              </button>
            </div>
          </form>
        </div>
      </div>
    </Fragment>
  );
};

export default EditCategoryModal;
