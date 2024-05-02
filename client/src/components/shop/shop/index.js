import React, { Fragment, useReducer,useEffect, useState,useContext } from "react";
import Layout from "../layout";
import { homeState, homeReducer } from "../home/HomeContext";
import { HomeContext } from "../home";
import ProductCategory from "../home/ProductCategory";
import SingleProduct from "../home/SingleProduct";
import { getAllCategory } from "../../admin/categories/FetchApi";
import { getAllProduct, productByPrice } from "../../admin/products/FetchApi";
import { productByCategory } from "../../admin/products/FetchApi";
import { useHistory } from "react-router-dom";

const ShopComponent = () => {
  const { data } = useContext(HomeContext);
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const history = useHistory();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await getAllCategory();
                if (response && response.Categories) {
                    setCategories(response.Categories);
                }
            } catch (error) {
                console.log("Error fetching categories:", error);
            }
        };

        fetchCategories();
    }, []);

    useEffect(() => {
        if (selectedCategory) {
            const fetchProducts = async () => {
                const response = await productByCategory(selectedCategory);
                if (response && response.Products) {
                    setProducts(response.Products);
                } else {
                    setProducts([]);
                }
            };
            fetchProducts();
        }
    }, [selectedCategory]);
    const handleCategorySelection = (categoryId) => {
      history.push(`/products/category/${categoryId}`); // Navigate to category-specific route
    };
  return (
    <Fragment>
        <div style={{ marginTop: '126px', display: 'grid', gridTemplateColumns: '1fr 4fr', gap: '1rem' ,paddingLeft: '20px'}}>
            {/* Sidebar Section */}
            <div className="sidebar" style={{ backgroundColor: "#f3f3f3", padding: '1rem' }}>
                {/* Add your sidebar content here, such as filters or category links */}
                <h3>Categories</h3>
                <ul>
                  {categories.map((category) => (
                    <li key={category._id} onClick={() => handleCategorySelection(category._id)}>
                      {category.cName}
                    </li>
                  ))}
                </ul>         
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
