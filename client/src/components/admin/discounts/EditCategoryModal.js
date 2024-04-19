import React, { Fragment, useContext, useState, useEffect } from "react";
import { CategoryContext } from "./index";
import { editCategory, getAllDiscount, getAllDiscount_Admin } from "./FetchApi";
import { getAllCategory, getAllCategory_Admin } from "../categories/FetchApi";

const EditCategoryModal = (props) => {
  const { data, dispatch } = useContext(CategoryContext);

  const [dId, setdId] = useState("");
  const [name, setName] = useState("");
  const [method, setMethod] = useState("");
  const [amount, setAmount] = useState(0);
  const [percent, setPercent] = useState(0);
  const [category, setCategory] = useState("");
  const [apply, setApply] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [categories, setCategories] = useState(null);


  useEffect(() => {
    setdId(data.editCategoryModal.dId);
    setName(data.editCategoryModal.name); // Add this line
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

  const fetchCategoryData = async () => {
    let responseData = await getAllCategory();
    if (responseData.Categories) {
      setCategories(responseData.Categories);
    }
  };

  const fetchData = async () => {
    let responseData = await getAllDiscount_Admin();
    if (responseData.Disounts) {
      dispatch({
        type: "fetchCategoryAndChangeState",
        payload: responseData.Disounts,
      });
    }
  };

  const submitForm = async () => {
    dispatch({ type: "loading", payload: true });
    let edit = await editCategory(dId, name, method, amount, percent, category, apply, status); // Update this line
    if (edit.error) {
      setError(edit.error);
      // dispatch({ type: "loading", payload: false });
    } else if (edit.success) {
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
              Edit Discount
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
          <div className="flex flex-col space-y-1 w-full">
            <label htmlFor="name">Discount Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="px-4 py-2 border focus:outline-none"
              name="name"
              id="name"
            />
          </div>
          {/* Display error */}
          {error && (
            <div className="text-red-500 text-sm">
              <span>Error: {error}</span>
            </div>
          )}
          <div className="flex flex-col space-y-1 w-full">
            <label htmlFor="method">Discount Method</label>
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
          <div className="flex flex-col space-y-1 w-full">
            <label htmlFor="amount">Discount Amount</label>
            <input
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="px-4 py-2 border focus:outline-none"
              name="amount"
              id="amount"
              disabled={method === "Percent"}
            />
          </div>
          <div className="flex flex-col space-y-1 w-full">
            <label htmlFor="percent">Discount Percent</label>
            <input
              type="text"
              value={percent}
              onChange={(e) => setPercent(e.target.value)}
              className="px-4 py-2 border focus:outline-none"
              name="percent"
              id="percent"
              disabled={method === "Amount"}
            />
          </div>
          <div className="w-1/2 flex flex-col space-y-1">
            <label htmlFor="discount">Discount Category *</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              name="discount"
              className="px-4 py-2 border focus:outline-none"
              id="discount"
            >
              <option disabled value="">
                Select a category
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
          <div className="flex flex-col space-y-1 w-full">
            <label htmlFor="apply">Apply Discount</label>
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
          <div className="flex flex-col space-y-1 w-full">
            <label htmlFor="status">Discount Status</label>
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
          <div className="flex flex-col space-y-1 w-full pb-4 md:pb-6">
            <button
              style={{ background: "#303031" }}
              onClick={(e) => submitForm()}
              className="rounded-full bg-gray-800 text-gray-100 text-lg font-medium py-2"
            >
              Update Discount
            </button>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default EditCategoryModal;
