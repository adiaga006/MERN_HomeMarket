import { createOrder } from "./FetchApi";

export const fetchData = async (cartListProduct, dispatch) => {
  dispatch({ type: "loading", payload: true });
  try {
    let responseData = await cartListProduct();
    if (responseData && responseData.Products) {
      setTimeout(function () {
        dispatch({ type: "cartProduct", payload: responseData.Products });
        dispatch({ type: "loading", payload: false });
      }, 1000);
    }
  } catch (error) {
    console.log(error);
  }
};

export const fetchbrainTree = async (getBrainTreeToken, setState) => {
  try {
    let responseData = await getBrainTreeToken();
    if (responseData && responseData) {
      setState({
        clientToken: responseData.clientToken,
        success: responseData.success,
      });
      console.log(responseData);
    }
  } catch (error) {
    console.log(error);
  }
};

export const pay = async (
  data,
  dispatch,
  state,
  setState,
  getPaymentProcess,
  totalCost,
  history
) => {
  console.log(state);
  if (!state.address) {
    setState({ ...state, error: "Please provide your address" });
  } else if (!state.phone) {
    setState({ ...state, error: "Please provide your phone number" });
  } else {
    let nonce;
    state.instance
      .requestPaymentMethod()
      .then((data) => {
        dispatch({ type: "loading", payload: true });
        nonce = data.nonce;
        let paymentData = {
          amountTotal: totalCost(),
          paymentMethod: nonce,
        };
        getPaymentProcess(paymentData)
          .then(async (res) => {
            if (res) {
              let orderData = {
                allProduct: JSON.parse(localStorage.getItem("cart")),
                user: JSON.parse(localStorage.getItem("jwt")).user._id,
                amount: (res.transaction.amount * 24.27).toFixed(0),
                transactionId: res.transaction.id,
                address: state.address,
                phone: state.phone,
                allDiscount: JSON.parse(localStorage.getItem("discount")),
              };
              try {
                let resposeData = await createOrder(orderData);
                if (resposeData.success) {
                  localStorage.setItem("cart", JSON.stringify([]));
                  localStorage.setItem("discount", JSON.stringify([]));
                  localStorage.setItem("category", JSON.stringify([]));
                  dispatch({ type: "cartProduct", payload: null });
                  dispatch({ type: "cartTotalCost", payload: null });
                  dispatch({ type: "orderSuccess", payload: true });
                  setState({ clientToken: "", instance: {} });
                  dispatch({ type: "loading", payload: false });
                  return history.push("/");
                } else if (resposeData.error) {
                  alert(resposeData.error); // Thông báo lỗi
                  console.log(resposeData.error);
                }
              } catch (error) {
                alert("Failed to create order"); // Thông báo lỗi
                setState({ ...state, error: "Failed to create order" });
                console.log(error);
              }
            }
          })
          .catch((err) => {
            setState({ ...state, error: "Failed to process payment" });
            alert("Failed to create order"); // Thông báo lỗi
            console.log(err);
          })
          .finally(() => {
            dispatch({ type: "loading", payload: false });
          });
      })
      .catch((error) => {
        alert(error.message); // Thông báo lỗi
        console.log(error);
        setState({ ...state, error: error.message });
        dispatch({ type: "loading", payload: false });
      });
  }
};
