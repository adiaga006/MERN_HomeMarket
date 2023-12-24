import { getAllOrder} from "./FetchApi";

export const fetchData = async (dispatch) => {
  dispatch({ type: "loading", payload: true });
  try {
    let responseData = await getAllOrder();

    // Mock asynchronous behavior with setTimeout
    setTimeout(async () => {
      if (responseData && responseData.Orders) {
        // let filteredOrders = responseData.Orders
        let filteredOrders = responseData.Orders.filter(order => order.status !== "Cancelled");

        const userTotalAmount = [];
        // Loop through the list of orders to calculate the total amount for each user
        for (const order of filteredOrders) {
          const userId = order.user._id;
          const userName = order.user.name;
          const email = order.user.email
          const orderTotal = order.amount;

          const userIndex = userTotalAmount.findIndex((u) => u.uId === userId);
          if (userIndex !== -1) {
            // User exists, update the total amount
            userTotalAmount[userIndex].total += orderTotal;
          } else {
            // User doesn't exist, add a new entry
            userTotalAmount.push({
              uId: userId,
              name: userName,
              email: email,
              total: orderTotal,
            });
          }
        }

        userTotalAmount.sort((a, b) => b.total - a.total);

        dispatch({
          type: "fetchOrderAndChangeState",
          payload: userTotalAmount,
        });
        dispatch({ type: "loading", payload: false });
      }
    }, 1000);
  } catch (error) {
    console.error("Error fetching data:", error);
    dispatch({ type: "loading", payload: false });
  }
};

/* This method call the editmodal & dispatch category context */
export const editOrderReq = (oId, type, status, dispatch) => {
  if (type) {
    console.log("click update");
    dispatch({ type: "updateOrderModalOpen", oId: oId, status: status });
  }
};



export const fetchOrdersByDate = async (startDate, endDate, dispatch,setError) => {
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
        (item) => item.status !== "Cancelled" &&
          new Date(item.createdAt).setHours(0, 0, 0, 0) >=
            new Date(startDate).setHours(0, 0, 0, 0) &&
          new Date(item.createdAt).setHours(23, 59, 59, 999) <=
            new Date(endDate).setHours(23, 59, 59, 999)
      );
    } else {
      // If start or end date is not provided, return all orders
      filteredOrders = responseData.Orders.filter(order => order.status !== "Cancelled");
    }
    const userTotalAmount = [];
        // Loop through the list of orders to calculate the total amount for each user
        for (const order of filteredOrders) {
          const userId = order.user._id;
          const userName = order.user.name;
          const email = order.user.email;
          const orderTotal = order.amount;

          const userIndex = userTotalAmount.findIndex((u) => u.uId === userId);
          if (userIndex !== -1) {
            // User exists, update the total amount
            userTotalAmount[userIndex].total += orderTotal;
          } else {
            // User doesn't exist, add a new entry
            userTotalAmount.push({
              uId: userId,
              name: userName,
              email: email,
              total: orderTotal,
            });
          }
        }

      userTotalAmount.sort((a, b) => b.total - a.total);

      dispatch({
        type: "fetchOrderAndChangeState",
        payload: userTotalAmount,
      });
    }
  } catch (error) {
    setError("An error occurred while fetching orders");
    console.error(error);
  }
};