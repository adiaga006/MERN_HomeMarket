import React, { Fragment, useReducer } from "react";
import Layout from "../layout";
import { homeState, homeReducer } from "../home/HomeContext";
import { HomeContext } from "../home";
import ProductCategory from "../home/ProductCategory";
import SingleProduct from "../home/SingleProduct";

const ShopComponent = () => {
  return (
    <Fragment>
        {/* Category, Search & Filter Section */}
        <section className="m-4 md:mx-8 md:my-6" style={{marginTop: '110px'}}>
            <ProductCategory />
        </section>
        {/* Product Section */}
        <section className="m-4 md:mx-8 md:my-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            <SingleProduct />
        </section>
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
