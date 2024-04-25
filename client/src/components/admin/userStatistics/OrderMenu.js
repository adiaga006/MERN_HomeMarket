import React, { Fragment, useState, useContext, useEffect } from "react";
import { OrderContext } from "./index";
import UpdateOrderModal from "./UpdateOrderModal";
import { fetchOrdersByDate } from "./Actions";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const OrderMenu = (props) => {
  const { data, dispatch } = useContext(OrderContext);
  const { orders } = data;
  const [dropdown, setDropdown] = useState(false);

  const totalOrderAmount = orders.reduce((acc, order) => acc + order.total, 0);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [error, setError] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("User Statistics"); // Default status

  useEffect(() => {
    // Fetch orders based on start and end dates
    fetchOrdersByDate(startDate, endDate, dispatch, setError);
  }, [startDate, endDate, dispatch, setError]);

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
              className="relative rounded-full text-gray-100 text-sm font-semibold uppercase"
            >
              <div
                onClick={(e) => setDropdown(!dropdown)}
                className="flex items-center rounded-full overflow-hidden p-2 justify-center"
              >
              </div>
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
              <span style={{ color: "black" }} >Total User Amount</span>
              <div className="rounded-full flex items-center justify-between overflow-hidden">
                <input
                  className="py-2 px-2 focus:outline-none rounded-r-full w-full"
                  value={`${totalOrderAmount}.000 VND`}
                  readOnly
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
