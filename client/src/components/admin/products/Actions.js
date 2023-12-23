import { getAllProduct_Admin } from "./FetchApi";

export const fetchData = async (dispatch) => {
  dispatch({ type: "loading", payload: true });
  let responseData = await getAllProduct_Admin();
  setTimeout(() => {
    if (responseData && responseData.Orders) {
      dispatch({
        type: "fetchProductsAndChangeState",
        payload: responseData.Products,
      });
      dispatch({ type: "loading", payload: false });
    }
  }, 1000);
};

export const fetchOrdersByProductName = async (productName, dispatch, setError) => {
  try {

    let responseData = await getAllProduct_Admin();
    if (responseData && responseData.Products) {
      let filteredOrders;

      if (productName) {
        const productNameLower = productName.toLowerCase();

        // Filter orders based on timestamps (createdAt) between start and end dates
        filteredOrders = responseData.Products.filter(
          (item) => removeDiacritics(item.pName.toLowerCase()).includes(productNameLower)
        );
      } else {
        // If start or end date is not provided, return all orders
        filteredOrders = responseData.Products;
      }
      dispatch({
        type: "fetchProductsAndChangeState",
        payload: filteredOrders,
      });
    }
  } catch (error) {
    setError("An error occurred while fetching orders");
    console.error(error);
  }
};

function removeDiacritics(str) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}