import React, { Fragment, useState, useContext, useEffect } from "react";
import { OrderContext } from "./index";
import UpdateOrderModal from "./UpdateOrderModal";
import { filterOrder, fetchOrdersByDate } from "./Actions";
import "react-datepicker/dist/react-datepicker.css";

const OrderMenu = (props) => {
  const { data, dispatch } = useContext(OrderContext);
  const [dropdown, setDropdown] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch orders based on start and end dates
  }, []);

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
            
            {/* Date picker components for start and end dates */}

          </div>
          {/*<AddCategoryModal/>*/}
          <UpdateOrderModal />
        </div>
      </div>
    </Fragment>
  );
};

export default OrderMenu;
