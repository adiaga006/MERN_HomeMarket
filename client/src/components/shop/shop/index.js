import React, { Fragment, useReducer } from "react";
import Layout from "../layout";
import { homeState, homeReducer } from "../home/HomeContext";
import { HomeContext } from "../home";
import ProductCategory from "../home/ProductCategory";
import SingleProduct from "../home/SingleProduct";

const ShopComponent = () => {
  return (
    <Fragment>
        <div style={{ marginTop: '110px', display: 'grid', gridTemplateColumns: '1fr 4fr', gap: '1rem' }}>
            {/* Sidebar Section */}
            <div className="sidebar" style={{ backgroundColor: "#f3f3f3", padding: '1rem' }}>
                {/* Add your sidebar content here, such as filters or category links */}
                Sidebar Content
            </div>

            {/* Main Content Section */}
            <div className="main-content">
                {/* Category, Search & Filter Section */}
                <section className="m-4 md:mx-8 md:my-6">
                    <ProductCategory />
                </section>
                {/* Product Section */}
                <section className="m-4 md:mx-8 md:my-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    <SingleProduct />
                </section>
            </div>
        </div>
    </Fragment>
  );
};
const Shop = (props) => {
    const [data, dispatch] = useReducer(homeReducer, homeState);
    return (
      <Fragment>
        <HomeContext.Provider value={{ data, dispatch }}>
          <Layout children={<ShopComponent />} />
        </HomeContext.Provider>
      </Fragment>
    );
};

export default Shop;
