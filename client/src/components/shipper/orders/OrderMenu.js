import React, { Fragment, useState, useContext, useEffect } from "react";
import { OrderContext } from "./index";
import UpdateOrderModal from "./UpdateOrderModal";
import SearchFilter from "./SearchFilter";
import { filterOrder, fetchOrdersByDate, fetchOrdersByTransactionId } from "./Actions";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const OrderMenu = (props) => {
  const { data, dispatch } = useContext(OrderContext);
  const [dropdown, setDropdown] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [transactionId, setTransactionId] = useState("");
  const [error, setError] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("All STATUS"); // Default status

  useEffect(() => {
    // Fetch orders based on start and end dates
    fetchOrdersByDate(startDate, endDate, dispatch, setError);
  }, [startDate, endDate, dispatch, setError]);

  useEffect(() => {
    // Fetch orders based on start and end dates
    fetchOrdersByTransactionId(transactionId, dispatch, setError);
  }, [transactionId, dispatch, setError]);

  const clearError = () => {
    setError(null);
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
              
            </div>
            {/* Date picker components for start and end dates */}
            <div>
              <DatePicker
                selected={startDate}
                onChange={(date) => {
                  clearError();
                  setStartDate(date);
                }}
                placeholderText="Select Start Date"
                dateFormat="yyyy-MM-dd"
              />
            </div>
            <div>
              <DatePicker
                selected={endDate}
                onChange={(date) => {
                  clearError();
                  setEndDate(date);
                }}
                placeholderText="Select End Date"
                dateFormat="yyyy-MM-dd"
              />
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
                  placeholder="Transaction id..."
                  className="py-2 px-2 focus:outline-none rounded-r-full w-full"
                  type="text"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                />
              </div>
            </div>
          </div>
          {/*<AddCategoryModal/>*/}
          <UpdateOrderModal />
        </div>
      </div>
    </Fragment>
  );
};

export default OrderMenu;
