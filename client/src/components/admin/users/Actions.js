import { getAllOrder, deleteOrder } from "./FetchApi";

export const fetchData = async (dispatch) => {
  dispatch({ type: "loading", payload: true });
  let responseData = await getAllOrder();
  setTimeout(() => {
    if (responseData && responseData.Users) {
      dispatch({
        type: "fetchOrderAndChangeState",
        payload: responseData.Users,
      });
      dispatch({ type: "loading", payload: false });
    }
  }, 1000);
};

/* This method call the editmodal & dispatch category context */
export const editOrderReq = (uId, type, role, dispatch) => {
  if (type) {
    console.log("click update");
    dispatch({ type: "updateOrderModalOpen", uId: uId, role: role });
  }
};

export const deleteOrderReq = async (uId, dispatch) => {
  let responseData = await deleteOrder(uId);
  console.log(responseData);
  if (responseData && responseData.success) {
    fetchData(dispatch);
  }
};

/* Filter All Order */
export const filterOrder = async (
  type,
  data,
  dispatch,
  dropdown,
  setDropdown
) => {
  let responseData = await getAllOrder();
  if (responseData && responseData.Orders) {
    let newData;
    if (type === "All STATUS") {
      dispatch({
        type: "fetchOrderAndChangeState",
        payload: responseData.Orders,
      });
      setDropdown(!dropdown);
    } else if (type === "Not processed") {
      newData = responseData.Orders.filter(
        (item) => item.status === "Not processed"
      );
      dispatch({ type: "fetchOrderAndChangeState", payload: newData });
      setDropdown(!dropdown);
    } else if (type === "Processing") {
      newData = responseData.Orders.filter(
        (item) => item.status === "Processing"
      );
      dispatch({ type: "fetchOrderAndChangeState", payload: newData });
      setDropdown(!dropdown);
    } else if (type === "Shipped") {
      newData = responseData.Orders.filter((item) => item.status === "Shipped");
      dispatch({ type: "fetchOrderAndChangeState", payload: newData });
      setDropdown(!dropdown);
    } else if (type === "Delivered") {
      newData = responseData.Orders.filter(
        (item) => item.status === "Delivered"
      );
      dispatch({ type: "fetchOrderAndChangeState", payload: newData });
      setDropdown(!dropdown);
    } else if (type === "Cancelled") {
      newData = responseData.Orders.filter(
        (item) => item.status === "Cancelled"
      );
      dispatch({ type: "fetchOrderAndChangeState", payload: newData });
      setDropdown(!dropdown);
    }
  }
};

export const fetchOrdersByDate = async (startDate, endDate, dispatch, setError) => {
  try {
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      const errorMessage = "Start date cannot be greater than end date";
      setError(errorMessage);
      return;
    }

    let responseData = await getAllOrder();
    if (responseData && responseData.Orders) {
      let filteredOrders;

      if (startDate && endDate) {
        // Filter orders based on timestamps (createdAt) between start and end dates
        filteredOrders = responseData.Orders.filter(
          (item) =>
            new Date(item.createdAt).setHours(0, 0, 0, 0) >=
            new Date(startDate).setHours(0, 0, 0, 0) &&
            new Date(item.createdAt).setHours(23, 59, 59, 999) <=
            new Date(endDate).setHours(23, 59, 59, 999)
        );
      } else {
        // If start or end date is not provided, return all orders
        filteredOrders = responseData.Orders;
      }

      dispatch({
        type: "fetchOrderAndChangeState",
        payload: filteredOrders,
      });
    }
  } catch (error) {
    setError("An error occurred while fetching orders");
    console.error(error);
  }
};