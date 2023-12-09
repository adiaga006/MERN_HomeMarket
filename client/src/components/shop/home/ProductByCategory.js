import React, { Fragment, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import Layout from "../layout";
import { productByCategory } from "../../admin/products/FetchApi";
import { Link } from "react-router-dom/cjs/react-router-dom.min";

const apiURL = process.env.REACT_APP_API_URL;

const Submenu = ({ category }) => {
  const history = useHistory();
  return (
    <Fragment>
      {/* Submenu Section */}
      <section className="mx-4 mt-24 md:mx-12 md:mt-32 lg:mt-24">
        <div className="flex justify-between items-center">
          <div className="text-sm flex space-x-3">
            <span
              className="hover:text-yellow-700 cursor-pointer"
              onClick={(e) => history.push("/shop")}
            >
              Shop
            </span>
            <span> / </span>
            <span className="text-yellow-700 cursor-default">{category}</span>
          </div>
          <div>
            <svg
              className="w-3 h-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 5l7 7-7 7M5 5l7 7-7 7"
              />
            </svg>
          </div>
        </div>
      </section>
      {/* Submenu Section */}
    </Fragment>
  );
};

const AllProduct = ({ products }) => {
  const history = useHistory();
  const category =
    products && products.length > 0 ? products[0].pCategory.cName : "";
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
                          <Link>{item.pName}</Link>
                      </h5>
                      <div className="ratings mt-auto">
                          <div className="rating-outer">
                              <div
                                  className="rating-inner"
                                  style={{ width: `${(item.pRatings / 5) * 100}%` }}
                              ></div>
                          </div>
                          <span id="no_of_reviews">({item.pNumOfReviews} Reviews)</span>
                      </div>
                      <p className="card-text">{item.pPrice}.000<span className="card-title"> ₫</span></p>
                      <Link
                          id="view_btn"
                          className="btn btn-block"
                          // onClick={addToCart}
                      >
                          Add to Cart
                      </Link>
                  </div>
                  <div className="absolute top-0 right-0 mx-2 my-2 md:mx-4">
                    <svg
                      className="w-5 h-5 md:w-6 md:h-6 cursor-pointer text-yellow-700"
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
                  </div>
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
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchData = async () => {
    try {
      let responseData = await productByCategory(catId);
      if (responseData && responseData.Products) {
        setProducts(responseData.Products);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Fragment>
      <AllProduct products={products} />
    </Fragment>
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
