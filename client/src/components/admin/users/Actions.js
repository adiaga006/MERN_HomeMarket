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
  if (responseData && responseData.Users) {
    let newData;
    if (type === "All ROLE") {
      dispatch({
        type: "fetchOrderAndChangeState",
        payload: responseData.Users,
      });
      setDropdown(!dropdown);
    } else if (type === "USER") {
      newData = responseData.Users.filter(
        (item) => item.userRole === 0
      );
      dispatch({ type: "fetchOrderAndChangeState", payload: newData });
      setDropdown(!dropdown);
    } else if (type === "ADMIN") {
      newData = responseData.Users.filter(
        (item) => item.userRole === 1
      );
      dispatch({ type: "fetchOrderAndChangeState", payload: newData });
      setDropdown(!dropdown);
    } else if (type === "SHIPPER") {
      newData = responseData.Users.filter((item) => item.userRole === 2);
      dispatch({ type: "fetchOrderAndChangeState", payload: newData });
      setDropdown(!dropdown);
    }
  }
};


export const fetchOrdersByTransactionId = async (transactionId, dispatch, setError) => {
  try {

    let responseData = await getAllOrder();
    if (responseData && responseData.Users) {
      let filteredOrders;

      if (transactionId) {
        // Filter orders based on timestamps (createdAt) between start and end dates
        filteredOrders = responseData.Users.filter(
          (item) => item.name.startsWith(transactionId)
        );
      } else {
        // If start or end date is not provided, return all orders
        filteredOrders = responseData.Users;
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