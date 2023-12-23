import React, { Fragment, useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import { getAllProduct } from "../../admin/products/FetchApi";
import { HomeContext } from "./index";
import { isWishReq, unWishReq, isWish } from "./Mixins";

import { LayoutContext } from "../layout";
import { updateQuantity, slideImage, addToCart, cartList } from "./Mixins";
import { totalCost } from "../partials/Mixins";
import { getSingleProduct } from "../productDetails/FetchApi";
import { cartListProduct } from "../partials/FetchApi";


import { Link } from "react-router-dom/cjs/react-router-dom.min";

const apiURL = process.env.REACT_APP_API_URL;

const SingleProduct = (props) => {

  const [quantitiy, setQuantitiy] = useState(1);
  const [pImages, setPimages] = useState(null);
  const { data: layoutData, dispatch: layoutDispatch } = useContext(LayoutContext);
  const [, setAlertq] = useState(false); // Alert when quantity greater than stock
  
  const { data, dispatch } = useContext(HomeContext);
  const { products } = data;
  const history = useHistory();

  /* WhisList State */
  const [wList, setWlist] = useState(
    JSON.parse(localStorage.getItem("wishList"))
  );

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchData = async () => {
    dispatch({ type: "loading", payload: true });
    try {
      let responseData = await getAllProduct();
      setTimeout(() => {
        if (responseData && responseData.Products) {
          dispatch({ type: "setProducts", payload: responseData.Products });
          dispatch({ type: "loading", payload: false });
        }
      }, 500);
    } catch (error) {
      console.log(error);
    }
    fetchCartProduct(); // Updating cart total
  };

  const fetchCartProduct = async () => {
    try {
      let responseData = await cartListProduct();
      if (responseData && responseData.Products) {
        layoutDispatch({ type: "cartProduct", payload: responseData.Products }); // Layout context Cartproduct fetch and dispatch
      }
    } catch (error) {
      console.log(error);
    }
  };
  if (data.loading) {
    return (
      <div className="col-span-12 md:col-span-3 lg:col-span-4 flex items-center justify-center py-24">
        <svg
          className="w-12 h-12 animate-spin text-gray-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          ></path>
        </svg>
      </div>
    );
  }
  return (
    <Fragment>
      {products && products.length > 0 ? (
        products.map((item, index) => {
          return (
            <Fragment key={index}>
              <div className="col-sm-12 col-md-6 col-lg-12 my-3 p-4">
                <div className="card p-3 rounded">
                  <img
                    onClick={(e) => history.push(`/products/${item._id}`)}
                    className="card-img-top mx-auto cursor-pointer"
                    src={item.pImages[0].url}
                    alt={item.pName}
                  />
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">
                      <Link to={`/products/${item._id}`}>{item.pName}</Link>
                    </h5>
                    <div className="ratings mt-auto">
                      <div className="rating-outer">
                        <div
                          className="rating-inner"
                          style={{ width: `${(item.pRatings / 5) * 100}%` }}
                        ></div>
                      </div>
                      <span id="no_of_reviews">
                        ({item.pNumOfReviews} Reviews)
                      </span>
                    </div>
                    <p class="card-home-price">{Math.round(item.pPrice - (item.pPrice * item.pOffer)/100)}.000<span class="card-title"> ₫</span></p>
                    {item.pOffer !==0 ? (
                      <Fragment>
                      <div className="flex items-center">
                      <p class="card-home-price-2 original-price">{item.pPrice}.000<span class="card-title"> ₫</span></p>
                      <span className="space-between"></span>
                      <p class="card-home-price-2 discount rounded">-{item.pOffer}%</p>
                      </div>
                      </Fragment>
                    ) : (
                      <div/>
                    )}
                    <div>
                      <span>Sold: {item.pSold}</span>
                    </div>
                  {/* {item.pQuantity !== 0 ? (
                <Fragment>
                  {layoutData.inCart !== null &&
                  layoutData.inCart.includes(item._id) === true ? (
                        <Link
                        id="view_btn"
                        className="btn btn-block "
                        >
                              <div className="stockCounter d-inline">
                                  <span className="btn" >-</span>

                                  <input type="number" style={{width:"73%",color:"black"}} className="form-control rounded count d-inline" value={quantitiy} readOnly />

                                   <span className="btn">+</span>
                              </div>
                      </Link>
                  ) : (
                    <Link
                    id="view_btn"
                    className="btn btn-block"
                    onClick={(e) =>
                      addToCart(
                        item._id,
                        quantitiy,
                        item.pPrice - ((item.pPrice * item.pOffer) / 100),
                        layoutDispatch,
                        setQuantitiy,
                        setAlertq,
                        () => fetchData(),
                        totalCost,
                        dispatch,
                        setPimages
                      )
                    }
                    >
                        Add to Cart
                  </Link>                  )}
                </Fragment>
              ) : (
                <Fragment>
                  {layoutData.inCart !== null &&
                  layoutData.inCart.includes(item._id) === true ? (
                        <Link
                        id="view_btn"
                        className="btn btn-block "
                        >
                              <div className="stockCounter d-inline">
                                  <span className="btn" >-</span>

                                  <input type="number" style={{width:"73%",color:"black"}} className="form-control rounded count d-inline" value={quantitiy} readOnly />

                                   <span className="btn">+</span>
                              </div>
                      </Link>
                  ) : (
                      <Link
                          id="view_btn"
                          className="btn btn-block cursor-not-allowed"
                          disabled={item.quantitiy === 0}

                          >
                              Out of Stock
                        </Link>
                  )}
                </Fragment>
              )} */}
                  </div>
                  {/* Wishlist Logic  */}
                  <div className="absolute top-0 right-0 mx-2 my-2 md:mx-4">
                  <svg
                    onClick={(e) => isWishReq(e, item._id, setWlist)}
                    className={`${
                      isWish(item._id, wList) && "hidden"
                    } w-5 h-5 md:w-6 md:h-6 cursor-pointer text-yellow-700 transition-all duration-300 ease-in`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                  <svg
                    onClick={(e) => unWishReq(e, item._id, setWlist)}
                    className={`${
                      !isWish(item._id, wList) && "hidden"
                    } w-5 h-5 md:w-6 md:h-6 cursor-pointer text-yellow-700 transition-all duration-300 ease-in`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                {/* WhisList Logic End */}
                </div>
              </div>
            </Fragment>
          );
        })
      ) : (
        <div className="col-span-2 md:col-span-3 lg:col-span-4 flex items-center justify-center py-24 text-2xl">
          No product found
        </div>
      )}
    </Fragment>
  );
};

export default SingleProduct;
