import React, { Fragment, useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import { getAllProduct } from "../../admin/products/FetchApi";
import { HomeContext } from "./index";
import { isWishReq, unWishReq, isWish } from "./Mixins";
import { Link } from "react-router-dom/cjs/react-router-dom.min";

const apiURL = process.env.REACT_APP_API_URL;

const SingleProduct = (props) => {
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
                    <p className="card-text">
                      {item.pPrice}.000<span className="card-title"> ₫</span>
                    </p>
                    <div>
                      <span>Sold: {item.pSold}</span>
                    </div>
                  </div>
                  {/* Wishlist Logic  */}
                  <div className="absolute top-0 right-0 mx-2 my-2 md:mx-4">
                    {/* ... (your wishlist logic remains unchanged) */}
                  </div>
                  {/* Wishlist Logic End */}
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
