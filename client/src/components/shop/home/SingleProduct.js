import React, { Fragment, useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import { getAllProduct } from "../../admin/products/FetchApi";
import { HomeContext } from "./index";
import { isWishReq, unWishReq, isWish } from "./Mixins";
import { LayoutContext } from "../layout";
import { quantityCartItem, updateQuantityCartItem } from "./Mixins";
import { addToCart, cartList } from "../productDetails/Mixins";
import { totalCost } from "../partials/Mixins";
import { getSingleProduct } from "../productDetails/FetchApi";
import { cartListProduct } from "../partials/FetchApi";
import { getAllCategory } from "../../admin/categories/FetchApi";
import { Link } from "react-router-dom/cjs/react-router-dom.min";

const apiURL = process.env.REACT_APP_API_URL;

const SingleProduct = (props) => {
  const [categories, setCategories] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [, setAlertq] = useState(false); // Alert when quantity greater than stock

  const { data, dispatch } = useContext(HomeContext);
  const { data: layoutData, dispatch: layoutDispatch } = useContext(LayoutContext);
  const { products } = data;
  const history = useHistory();

  /* WhisList State */
  const [wList, setWlist] = useState(
    JSON.parse(localStorage.getItem("wishList"))
  );

  useEffect(() => {
    fetchData();
    const fetchCategories = async () => {
      const response = await getAllCategory();
      if (response && response.Categories) {
        setCategories(response.Categories.filter(category => category.cParentCategory == null).reverse());
      }
    };
    fetchCategories();
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
          layoutDispatch({ type: "inCart", payload: cartList() });
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

  // State to track the number of visible products for each category
  const [visibleProducts, setVisibleProducts] = useState({});

  const handleShowMore = (categoryId) => {
    setVisibleProducts((prev) => ({
      ...prev,
      [categoryId]: (prev[categoryId] || 8) + 8,
    }));
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
      <div>
        {categories.map((category) => {
          const productsInCategory = products.filter((product) => product.pCategory.cParentCategory === category._id);
          const visibleProductCount = visibleProducts[category._id] || 8;
          const remainingProductsCount = productsInCategory.length - visibleProductCount;

          return (
            <div id={category.cName} key={category._id}>
              <div className="category-header">
                <h2>{category.cName}</h2>
              </div>
              <div className="product-list">
                {products && products.length > 0 ? (
                  productsInCategory
                    .slice(0, visibleProductCount)
                    .map((item, index) => (
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
                              <p className="card-home-price">{Math.round(item.pPrice - (item.pPrice * item.pOffer) / 100)}.000<span className="card-title"> ₫</span></p>
                              {item.pOffer !== 0 ? (
                                <Fragment>
                                  <div className="flex items-center">
                                    <p className="card-home-price-2 original-price">{item.pPrice}.000<span className="card-title"> ₫</span></p>
                                    <span className="space-between"></span>
                                    <p className="card-home-price-2 discount rounded">-{item.pOffer}%</p>
                                  </div>
                                </Fragment>
                              ) : (
                                <div />
                              )}
                              {item.pQuantity !== 0 ? (
                                <Fragment>
                                  {layoutData.inCart !== null &&
                                    layoutData.inCart.includes(item._id) === true ? (
                                    <div
                                      id="view_btn"
                                      className="btn btn-block"
                                    >
                                      <div className="text-input">
                                        <span className="btn_plus"
                                          onClick={(e) =>
                                            updateQuantityCartItem(
                                              item._id,
                                              quantityCartItem(item._id) - 1,
                                              layoutDispatch,
                                              fetchCartProduct
                                            )}
                                        > - </span>

                                        <input type="number" style={{ width: "59%", height: "20%", color: "black" }} className="text-input" value={quantityCartItem(item._id)} readOnly />

                                        <span className="btn_plus"
                                          onClick={(e) =>
                                            updateQuantityCartItem(
                                              item._id,
                                              quantityCartItem(item._id) + 1,
                                              layoutDispatch,
                                              fetchCartProduct
                                            )}
                                        >+</span>
                                      </div>
                                    </div>
                                  ) : (
                                    <div
                                      id="view_btn"
                                      className="btn btn-block"
                                      onClick={(e) =>
                                        addToCart(
                                          item._id,
                                          item.pCategory,
                                          quantity,
                                          item.pOffer,
                                          item.pPrice,
                                          Math.round(item.pPrice * (1 - (item.pOffer / 100))),
                                          layoutDispatch,
                                          setQuantity,
                                          setAlertq,
                                          fetchCartProduct,
                                          totalCost
                                        )
                                      }
                                    >
                                      <svg
                                        className="add-to-cart-icon MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-vubbuv"
                                        focusable="false"
                                        aria-hidden="true"
                                        viewBox="0 0 24 24"
                                        data-testid="AddShoppingCartIcon"
                                        style={{ verticalAlign: 'middle' }}  // Đảm bảo thẳng hàng với chữ
                                      >
                                        <path d="M11 9h2V6h3V4h-3V1h-2v3H8v2h3v3zm-4 9c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2zm-9.83-3.25.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.86-7.01L19.42 4h-.01l-1.1 2-2.76 5H8.53l-.13-.27L6.16 6l-.95-2-.94-2H1v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.13 0-.25-.11-.25-.25z"></path>
                                      </svg>
                                      Add to Cart
                                    </div>
                                  )}
                                </Fragment>
                              ) : (
                                <div
                                  id="view_btn"
                                  style={{ background: "#303031" }}
                                  className="px-4 py-2 text-white text-center cursor-not-allowed uppercase opacity-75"
                                  disabled={item.quantity === 0}
                                >
                                  Out of Stock
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </Fragment>
                    ))
                ) : (
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
                )}
                {remainingProductsCount > 0 && (
                  <div className="product-footer">
                    <div className="show-more">
                      <button style={{ backgroundColor: "green" }} onClick={() => handleShowMore(category._id)}>
                        Xem thêm {remainingProductsCount} sản phẩm {category.cName}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Fragment>
  );
};

export default SingleProduct;
