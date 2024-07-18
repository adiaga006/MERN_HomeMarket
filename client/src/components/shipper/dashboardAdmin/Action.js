import { getAllOrder } from "./FetchApi.js";

export const todayAllOrders = async (dispatch) => {
  let responseData = await getAllOrder();
  if (responseData) {
    dispatch({ type: "totalOrders", payload: responseData.Orders.filter(order => order.deliveryDateTime !== undefined && order.shipper._id ===  (JSON.parse(localStorage.getItem("jwt")).user._id))});
  }
};
