import React, { Fragment, useContext, useState, useEffect } from "react";
import { ProductContext } from "./index";
import { fetchOrdersByProductName } from "./Actions";
import AddProductModal from "./AddProductModal";
import EditProductModal from "./EditProductModal";

const ProductMenu = (props) => {
  const { dispatch } = useContext(ProductContext);
  const [productName, setProductName] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch orders based on start and end dates
    fetchOrdersByProductName(productName, dispatch, setError);
  }, [productName, dispatch, setError]);

  const clearError = () => {
    setError(null);
  };


  return (
    <Fragment>
      <div className="col-span-1 flex justify-between items-center">
        <div className="flex items-center">
          {/* It's open the add product modal */}
          <span
            style={{ background: "#303031" }}
            onClick={(e) =>
              dispatch({ type: "addProductModal", payload: true })
            }
            className="rounded-full cursor-pointer p-2 bg-gray-800 flex items-center text-gray-100 text-sm font-semibold uppercase"
          >
            <svg
              className="w-6 h-6 text-gray-100 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                clipRule="evenodd"
              />
            </svg>
            Add Product
          </span>
        </div>

        <div>
          <div className="rounded-full flex items-center justify-between overflow-hidden">
            <span style={{ background: "#303031" }} className="py-2 px-3 cursor-pointer">
              <svg
                className="rounded-l-full w-6 h-6 text-gray-100"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
            <input
              placeholder="Product name..."
              className="py-2 px-2 focus:outline-none rounded-r-full w-full"
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
            />
          </div>
        </div>
        <AddProductModal />
        <EditProductModal />
      </div>
    </Fragment>
  );
};

export default ProductMenu;
