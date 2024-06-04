import React, { Fragment, useEffect, useState, useContext } from "react";
import { useHistory, useParams } from "react-router-dom";
import Layout from "../layout";
import { productByCategory } from "../../admin/products/FetchApi";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import { isWishReq, unWishReq, isWish } from "./Mixins";
import { LayoutContext } from "../layout";
import { quantityCartItem, updateQuantityCartItem } from "./Mixins";
import { addToCart } from "../productDetails/Mixins";
import { totalCost } from "../partials/Mixins";
import { cartListProduct } from "../partials/FetchApi";
import { getAllCategory } from "../../admin/categories/FetchApi";
import { HomeContext } from "../home";
const Sidebar = () => {
  const [categories, setCategories] = useState([]);
  const history = useHistory();

  const [selectedParentCategory, setSelectedParentCategory] = useState(null);
  const parentCategories = categories.filter(category => category.cParentCategory == null).reverse();
  const child = categories.filter(category => category.cParentCategory !== null);
  const childCategories = child.filter(category =>
    category.cParentCategory && selectedParentCategory &&
    category.cParentCategory._id === selectedParentCategory
  ).reverse();
  useEffect(() => {
    const fetchCategories = async () => {
      const response = await getAllCategory();
      if (response && response.Categories) {
        setCategories(response.Categories);
      }
    };
    fetchCategories();
  }, []);

  const handleCategorySelection = (categoryId) => {
    history.push(`/products/category/${categoryId}`);
  };

  return (
    <div className="sidebar" style={{ backgroundColor: "#f3f3f3", padding: '0rem' }}>
      <div style={{ backgroundColor: '#8DECB4', color: 'Black', padding: '1rem', display: 'flex', alignItems: 'center', fontWeight: "bold" }}>
        <h3>Categories</h3>
      </div>
      {/* <ul className="sidebar" style={{ backgroundColor: "#f3f3f3", padding: '1rem' }} >
        {categories.map((category) => (
          <li key={category._id} onClick={() => handleCategorySelection(category._id)}>
            {category.cName}
          </li>
        ))}
      </ul> */}
      <ul>
        <div className="sidebar" style={{ backgroundColor: "#f3f3f3", padding: '1rem' }}>
          <ul>
            {parentCategories.map(parentCategory => (
              <li
                key={parentCategory._id}
                onClick={() => setSelectedParentCategory(parentCategory._id)}
                style={{ cursor: 'pointer', fontWeight: selectedParentCategory === parentCategory._id ? 'bold' : 'normal' }}
              >
                {parentCategory.cName}
              </li>
            ))}
          </ul>
        </div>

        <div className="sidebar" style={{ backgroundColor: "#f3f3f3", padding: '1rem' }}>
          <ul>
            {childCategories.map(childCategory => (
              <li
                key={childCategory._id}
                onClick={() => handleCategorySelection(childCategory._id)}
                style={{ cursor: 'pointer' }}
              >
                {childCategory.cName}
              </li>
            ))}
          </ul>
        </div>
      </ul>
    </div>
  );
};

const Submenu = ({ category }) => {
  const history = useHistory();

  return (
    <Fragment>
      {/* Submenu Section */}
      <div className="submenu" style={{ position: 'absolute', top: 74, left: 0, width: '100%', padding: '1rem', backgroundColor: '#fff' }}>
        <div className="text-sm">
          <span
            className="hover:text-green-700 cursor-pointer"
            onClick={(e) => history.push("/shop")}
          >
            Shop
          </span>
          <span> / </span>
          <span className="text-green-700 cursor-default">{category}</span>
        </div>
      </div>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13 5l7 7-7 7M5 5l7 7-7 7"
      />


      {/* Submenu Section */}
    </Fragment>
  );
};

const AllProduct = ({ products }) => {
  const history = useHistory();
  const category =
    products && products.length > 0 ? products[0].pCategory.cName : "";

  const [quantitiy, setQuantitiy] = useState(1);
  const [, setAlertq] = useState(false); // Alert when quantity greater than stock

  const { data: layoutData, dispatch: layoutDispatch } = useContext(LayoutContext);
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
  /* WhisList State */
  const [wList, setWlist] = useState(
    JSON.parse(localStorage.getItem("wishList"))
  );
  return (
    <Fragment>
      <Submenu category={category} />
      <section className="m-4 md:mx-8 md:my-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {products && products.length > 0 ? (
          products.map((item, index) => {
            return (
              <Fragment key={index}>
                <div className="col-sm-12 col-md-6 col-lg-12 my-3 p-4">
                  <div className="card p-3 rounded">
                    <img
                      onClick={(e) => history.push(`/products/${item._id}`)}
                      className="card-img-top mx-auto cursor-pointer"
                      // className="w-full object-cover object-center cursor-pointer"
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
                        <div className="flex items-center">
                          <p className="card-home-price-2 original-price">{item.pPrice}.000<span className="card-title"> ₫</span></p>
                          <p className="card-home-price-2 discount rounded">-{item.pOffer}%</p>
                        </div>
                      ) : (
                        <div />
                      )}

                      {item.pQuantity !== 0 ? (
                        <Fragment>
                          {layoutData.inCart !== null &&
                            layoutData.inCart.includes(item._id) === true ? (
                            <div
                              id="view_btn"
                              className="btn btn-block "
                            >
                              <div className="text-input">
                                <span className="btn_plus"
                                  onClick={(e) =>
                                    updateQuantityCartItem(
                                      item._id,
                                      quantityCartItem(item._id) - 1,
                                      layoutDispatch,
                                      fetchCartProduct
                                    )}>-</span>

                                <input type="number" style={{ width: "59%", height: "20%", color: "black" }} className="text-input" value={quantityCartItem(item._id)} readOnly />

                                <span className="btn_plus"
                                  onClick={(e) =>
                                    updateQuantityCartItem(
                                      item._id,
                                      quantityCartItem(item._id) + 1,
                                      layoutDispatch,
                                      fetchCartProduct
                                    )}>+</span>
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
                                  quantitiy,
                                  item.pOffer,
                                  item.pPrice,
                                  Math.round(item.pPrice * (1 - (item.pOffer / 100))),
                                  layoutDispatch,
                                  setQuantitiy,
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
                            </div>)}
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
                                <span className="btn_plus"
                                  onClick={(e) =>
                                    updateQuantityCartItem(
                                      item._id,
                                      quantityCartItem(item._id) - 1,
                                      layoutDispatch,
                                      fetchCartProduct
                                    )}>-</span>

                                <input type="number" style={{ width: "59%", height: "20%", color: "black" }} className="text-input" value={quantityCartItem(item._id)} readOnly />

                                <span className="btn_plus"
                                  onClick={(e) =>
                                    updateQuantityCartItem(
                                      item._id,
                                      quantityCartItem(item._id) + 1,
                                      layoutDispatch,
                                      fetchCartProduct
                                    )}>+</span>
                              </div>
                            </Link>
                          ) : (
                            <div
                              id="view_btn"
                              style={{ background: "#303031" }}
                              className="px-4 py-2 text-white text-center cursor-not-allowed uppercase opacity-75"
                              disabled={item.quantitiy === 0}
                            >
                              Out of Stock
                            </div>
                          )}
                        </Fragment>
                      )}
                    </div>
                    <div className="absolute top-0 right-0 mx-2 my-2 md:mx-4">
                      <svg
                        onClick={(e) => isWishReq(e, item._id, setWlist)}
                        className={`${isWish(item._id, wList) && "hidden"
                          } w-5 h-5 md:w-6 md:h-6 cursor-pointer text-green-700 transition-all duration-300 ease-in`}
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
                        className={`${!isWish(item._id, wList) && "hidden"
                          } w-5 h-5 md:w-6 md:h-6 cursor-pointer text-green-700 transition-all duration-300 ease-in`}
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
      </section>
    </Fragment>
  );
};
const PageComponent = () => {
  const [products, setProducts] = useState(null);
  const { catId } = useParams();
  useEffect(() => {
    const fetchData = async () => {
      if (catId) {
        const responseData = await productByCategory(catId);
        if (responseData && responseData.Products) {
          setProducts(responseData.Products);
        } else {
          setProducts([]);
        }
      }
    };
    fetchData();
  }, [catId]);


  return (
    <Layout>
      <div style={{ display: 'flex', marginTop: '126px', paddingLeft: '20px' }}>
        <Sidebar />
        <div style={{ flex: 1, paddingLeft: '20px' }}> {/* Additional padding to ensure spacing between sidebar and products */}
          <AllProduct products={products} />
        </div>
      </div>
    </Layout>
  );
};

const ProductByCategory = (props) => {
  return (
    <Fragment>
      <Layout children={<PageComponent />} />
    </Fragment>
  );
};

export default ProductByCategory;
