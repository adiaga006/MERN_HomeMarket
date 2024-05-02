import React, { Fragment, useEffect, useState,useContext } from "react";
import { useHistory, useParams } from "react-router-dom";
import Layout from "../layout";
import { productByCategory } from "../../admin/products/FetchApi";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import { isWishReq, unWishReq, isWish } from "./Mixins";
import { getAllCategory } from "../../admin/categories/FetchApi";
import { HomeContext } from "../home";
const Sidebar = () => {
  const [categories, setCategories] = useState([]);
  const history = useHistory();

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
    <div style={{ backgroundColor: '#8DECB4', color: 'white', padding: '0rem', display: 'flex', alignItems: 'center' }}>
      <h3>Categories</h3>
      </div>
      <ul className="sidebar" style={{ backgroundColor: "#f3f3f3", padding: '1rem' }} >
        {categories.map((category) => (
          <li key={category._id} onClick={() => handleCategorySelection(category._id)}>
            {category.cName}
          </li>
        ))}
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
              className="hover:text-yellow-700 cursor-pointer"
              onClick={(e) => history.push("/shop")}
            >
              Shop
            </span>
            <span> / </span>
            <span className="text-yellow-700 cursor-default">{category}</span>
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
                      <p class="card-home-price">{Math.round(item.pPrice - (item.pPrice * item.pOffer) / 100)}.000<span class="card-title"> ₫</span></p>
                      {item.pOffer !== 0 ? (
                        <div className="flex items-center">
                          <p class="card-home-price-2 original-price">{item.pPrice}.000<span class="card-title"> ₫</span></p>
                          <p class="card-home-price-2 discount rounded">-{item.pOffer}%</p>
                        </div>
                      ) : (
                        <div />
                      )}
                      <div>
                        <span>Sold: {item.pSold}</span>
                      </div>
                      {/* <Link
                          id="view_btn"
                          className="btn btn-block"
                          // onClick={addToCart}
                      >
                          Add to Cart
                      </Link> */}
                    </div>
                    <div className="absolute top-0 right-0 mx-2 my-2 md:mx-4">
                      <svg
                        onClick={(e) => isWishReq(e, item._id, setWlist)}
                        className={`${isWish(item._id, wList) && "hidden"
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
                        className={`${!isWish(item._id, wList) && "hidden"
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
