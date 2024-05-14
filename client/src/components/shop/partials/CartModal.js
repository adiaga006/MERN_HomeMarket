import React, { Fragment, useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { LayoutContext } from "../index";
import { addDiscount } from "./Action";
import { cartListProduct, getProductDetail } from "./FetchApi";
import { isAuthenticate } from "../auth/fetchApi";
import { cartList } from "../productDetails/Mixins";
import { subTotal, quantity, totalCost } from "./Mixins";


const CartModal = () => {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const { data, dispatch } = useContext(LayoutContext);
  const [error, setError] = useState(null);

  const [fData, setFdata] = useState({
    dName: ""
  });

  const products = data.cartProduct;

  const cartModalOpen = () =>
    dispatch({ type: "cartModalToggle", payload: !data.cartModal });

  useEffect(() => {
    fetchData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const clearError = () => {
    setError(null);
  };

  

  const fetchData = async () => {
    try {
      let responseData = await cartListProduct();
      if (responseData && responseData.Products) {
        dispatch({ type: "cartProduct", payload: responseData.Products });
        dispatch({ type: "cartTotalCost", payload: totalCost() });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const removeCartProduct = (id) => {
    let cart = localStorage.getItem("cart")
      ? JSON.parse(localStorage.getItem("cart"))
      : [];
    if (cart.length !== 0) {
      cart = cart.filter((item) => item.id !== id);
      localStorage.setItem("cart", JSON.stringify(cart));
      fetchData();
      dispatch({ type: "inCart", payload: cartList() });
      dispatch({ type: "cartTotalCost", payload: totalCost() });
    }
    if (cart.length === 0) {
      dispatch({ type: "cartProduct", payload: null });
      fetchData();
      dispatch({ type: "inCart", payload: cartList() });
    }
  };

  const changeProductQuantity = (itemId, type) => {
    if (loading) return;
    setLoading(true);
    let carts = JSON.parse(localStorage.getItem("cart"));
    const item = carts.find((product) => product.id === itemId);
    if (!item || (type === "-" && item.quantitiy === 1)) {
      setLoading(false);
      return;
    }
    getProductDetail(itemId).then((data) => {
      if (type === "+") {
        item.quantitiy++;
        if (item.quantitiy > data.Product.pQuantity) {
          setLoading(false);
          alert("Stock limited!");
          return;
        }
      } else if (type === "-") item.quantitiy--;
      localStorage.setItem("cart", JSON.stringify(carts));
      fetchData();
      setLoading(false);
    });
  };

  const submitForm = async (e) => {
    dispatch({ type: "loading", payload: true });
    // Reset and prevent the form
    e.preventDefault();
    e.target.reset();
    
    try {
      let responseData = await addDiscount({ dName: fData.dName, setError });
      if (responseData) {
        fetchData();
        setFdata({
          ...fData,
          dName: ""
        });
        dispatch({ type: "loading", payload: false });
        setTimeout(() => {
          setFdata({
            ...fData,
            dName: ""
          });
        }, 2000);
        clearError()
      } else if (!responseData) {
        fetchData();
        setFdata({
          ...fData,
          dName: ""
        });
        dispatch({ type: "loading", payload: false });
        setTimeout(() => {
          setFdata({
            ...fData,
            dName: ""
          });
        }, 2000);
        setTimeout(() => {
          clearError();
        }, 5000);
      }else if (responseData.error) {
        setFdata({ ...fData,});
        dispatch({ type: "loading", payload: false });
        setTimeout(() => {
          return setFdata({ ...fData,});
        }, 2000);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Fragment>
      {/* Black Overlay */}
      <div
        className={`${!data.cartModal ? "hidden" : ""
          } fixed top-0 z-30 w-full h-full bg-black opacity-50`}
      />
      {/* Cart Modal Start */}
      <section
        className={`${!data.cartModal ? "hidden" : ""
          } fixed z-40 inset-0 flex items-start justify-end`}
      >
        <div
          style={{ background: "#303031" }}
          className="w-full md:w-5/12 lg:w-4/12 h-full flex flex-col justify-between"
        >
          <div className="overflow-y-auto">
            <div className="border-b border-gray-700 flex justify-between">
              <div className="p-4 text-white text-lg font-semibold">Cart</div>
              {/* Cart Modal Close Button */}
              <div className="p-4 text-white">
                <svg
                  onClick={(e) => cartModalOpen()}
                  className="w-6 h-6 cursor-pointer"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
            <div className="m-4 flex-col">
              {products &&
                products.length !== 0 &&
                products.map((item, index) => {
                  return (
                    <Fragment key={index}>
                      {/* Cart Product Start */}
                      <div className="text-white flex space-x-2 my-4 items-center">
                        <img
                          className="w-16 h-16 object-cover object-center"
                          src={item.pImages[0].url}
                          alt="cartProduct"
                        />
                        <div className="relative w-full flex flex-col">
                          <div className="my-2">{item.pName}</div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center justify-between space-x-2">
                              Quantity:
                              <div className="stockCounter d-inline space-x-2">
                                <button
                                  className="rounded btn-danger minus ml-2"
                                  onClick={() =>
                                    changeProductQuantity(item._id, "-")
                                  }
                                >
                                  -
                                </button>
                                <input type="number" style={{ color: "black" }} className="rounded" value={quantity(item._id)} readOnly />
                                <button
                                  className="rounded btn-primary plus"
                                  onClick={() =>
                                    changeProductQuantity(item._id, "+")
                                  }
                                >
                                  +
                                </button>
                              </div>
                            </div>
                            <div>
                              {" "}
                              <span className="text-sm text-gray-400">
                                Subtotal :
                              </span>{" "}
                              {subTotal(item._id, Math.round(item.pPrice - (item.pPrice * item.pOffer) / 100))}.000 VND
                            </div>{" "}
                            {/* SUbtotal Count */}
                          </div>
                          {/* Cart Product Remove Button */}
                          <div
                            onClick={(e) => removeCartProduct(item._id)}
                            className="absolute top-0 right-0 text-white"
                          >
                            <svg
                              className="w-5 h-5 cursor-pointer"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                fillRule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>
                      {/* Cart Product Start */}
                    </Fragment>
                  );
                })}

              {products === null && (
                <div className="m-4 flex-col text-white text-xl text-center">
                  No product in cart
                </div>
              )}
            </div>
          </div>
          <div className="m-4 space-y-4">
          {error && <div style={{ color: "red" }}>{error}</div>}
            <form className="w-full" onSubmit={(e) => submitForm(e)}>
              <div className="flex space-x-1 py-4">
                <input
                  placeholder="Discount code"
                  onChange={(e) =>
                    setFdata({
                      ...fData,
                      dName: e.target.value,
                    })
                  }
                  value={fData.dName}
                  className="w-2/3 flex flex-col space-y-1"
                  type="text"
                />
                <button
                  style={{ background: "#303031" }}
                  type="submit"
                  className="w-1/3 flex flex-col space-y-1"
                >
                  Confirm
                </button>
              </div>
            </form>

            {/* <div
              onClick={(e) => cartModalOpen()}
              className="cursor-pointer px-4 py-2 border border-gray-400 text-white text-center cursor-pointer"
            >
              Continue shopping
            </div> */}
            {data.cartTotalCost ? (
              <Fragment>
                {isAuthenticate() ? (
                  <div
                    className="px-4 py-2 bg-black text-white text-center cursor-pointer"
                    onClick={(e) => {
                      history.push("/checkout");
                      cartModalOpen();
                    }}
                  >
                    Checkout {data.cartTotalCost}.000 VND
                  </div>
                ) : (
                  <div
                    className="px-4 py-2 bg-black text-white text-center cursor-pointer"
                    onClick={(e) => {
                      history.push("/");
                      cartModalOpen();
                      dispatch({
                        type: "loginSignupError",
                        payload: !data.loginSignupError,
                      });
                      dispatch({
                        type: "loginSignupModalToggle",
                        payload: !data.loginSignupModal,
                      });
                    }}
                  >
                    Checkout {data.cartTotalCost}.000 VND
                  </div>
                )}
              </Fragment>
            ) : (
              <div className="px-4 py-2 bg-black text-white text-center cursor-not-allowed">
                Checkout
              </div>
            )}
          </div>
        </div>
      </section>
      {/* Cart Modal End */}
    </Fragment>
  );
};

export default CartModal;
