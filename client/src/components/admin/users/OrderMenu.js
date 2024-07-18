import React, { Fragment, useState, useContext, useEffect } from "react";
import { OrderContext } from "./index";
import UpdateOrderModal from "./UpdateOrderModal";
import { filterOrder, fetchOrdersByTransactionId } from "./Actions";
import "react-datepicker/dist/react-datepicker.css";

const OrderMenu = (props) => {
  const { data, dispatch } = useContext(OrderContext);
  const [transactionId, setTransactionId] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All ROLE"); // Default status
  const [dropdown, setDropdown] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch orders based on start and end dates
    fetchOrdersByTransactionId(transactionId, dispatch, setError);
  }, [transactionId, dispatch, setError]);

  const clearError = () => {
    setError(null);
  };

  const handleStatusClick = (status) => {
    setSelectedStatus(status);
    filterOrder(status, data, dispatch, dropdown, setDropdown);
  };



  return (
    <Fragment>
      <div>
        {error && <div style={{ color: "red" }}>{error}</div>}
        <div className="col-span-1 flex items-center">
          <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-center md:space-y-0 w-full">
            {/* It's open the add order modal */}
            <div
              style={{ background: "#303031" }}
              className="relative rounded-full text-gray-100 text-sm font-semibold uppercase"
            >
              <div
                onClick={(e) => setDropdown(!dropdown)}
                className="flex items-center cursor-pointer rounded-full overflow-hidden p-2 justify-center"
              >
                <svg
                  className="w-6 h-6 text-gray-100 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z" />
                </svg>
                <span className="pr-2">{selectedStatus}</span>
              </div>
              <div
                style={{ background: "#303031" }}
                className={`${dropdown ? "" : "hidden"
                  } absolute top-0 left-0 mt-12 rounded-lg overflow-hidden w-full md:w-48 flex flex-col z-10`}
              >
                <span
                  onClick={(e) => handleStatusClick("All Role")}
                  className="px-4 py-2 hover:bg-black text-center cursor-pointer"
                >
                  All ROLE
                </span>
                <span
                  onClick={(e) => handleStatusClick("USER")}
                  className="px-4 py-2 hover:bg-black text-center cursor-pointer"
                >
                  USER
                </span>
                <span
                  onClick={(e) => handleStatusClick("ADMIN")}
                  className="px-4 py-2 hover:bg-black text-center cursor-pointer"
                >
                  ADMIN
                </span>
                <span
                  onClick={(e) => handleStatusClick("SHIPPER")}
                  className="px-4 py-2 hover:bg-black text-center cursor-pointer"
                >
                  SHIPPER
                </span>
              </div>
            </div>
            {/* Date picker components for start and end dates */}
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
                  placeholder="Tên người dùng..."
                  className="py-2 px-2 focus:outline-none rounded-r-full w-full"
                  type="text"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                />
              </div>
            </div>        
          {/*<AddCategoryModal/>*/}
          </div>
          <UpdateOrderModal />
        </div>
      </div>
    </Fragment>
  );
};

export default OrderMenu;
