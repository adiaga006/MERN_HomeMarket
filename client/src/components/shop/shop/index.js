import React, { Fragment, useReducer, useEffect, useState, useContext } from "react";
import Layout from "../layout";
import _ from 'lodash';
import { homeState, homeReducer } from "../home/HomeContext";
import { HomeContext } from "../home";
import ProductCategory from "../home/ProductCategory";
import SingleProduct from "../home/SingleProduct";
import { getAllCategory } from "../../admin/categories/FetchApi";
import { getAllProduct, productByPrice, productByCategory } from "../../admin/products/FetchApi";
import { useHistory } from "react-router-dom";

const CategoryItem = ({ category, onClick, isSelected, children }) => (
  <li onClick={onClick} style={{ cursor: 'pointer', fontWeight: isSelected ? 'bold' : 'normal' }}>
    {category.cName}
    {children}
  </li>
);

const ShopComponent = () => {
  const { data } = useContext(HomeContext);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedParentCategory, setSelectedParentCategory] = useState(null);
  const history = useHistory();

  const parentCategories = categories.filter(category => category.cParentCategory == null).reverse();
  const childCategories = categories.filter(category =>
    category.cParentCategory && selectedParentCategory &&
    category.cParentCategory._id === selectedParentCategory
  ).reverse();

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
    history.push(`/products/category/${categoryId}`);
  };

  return (
    <Fragment>
      <div style={{ marginTop: '126px', display: 'grid', gridTemplateColumns: '1fr 4fr', gap: '1rem', paddingLeft: '20px' }}>
        {/* Sidebar Section */}
        <div className="sidebar" style={{ backgroundColor: "#f3f3f3", padding: '0rem' }}>
          <div style={{ backgroundColor: '#8DECB4', color: 'Black', padding: '1rem', display: 'flex', alignItems: 'center', fontWeight: "bold" }}>
            <h3>Categories</h3>
          </div>
          <ul>
            {/* Parent Categories */}
            <div className="slidebar" style={{ backgroundColor: "#f3f3f3", padding: '1rem' }}>
            <ul>
            {parentCategories.map(parentCategory => (
              <CategoryItem
                key={parentCategory._id}
                category={parentCategory}
                onClick={() => setSelectedParentCategory(parentCategory._id)}
                isSelected={selectedParentCategory === parentCategory._id}
              >
                {/* Child Categories */}
                {selectedParentCategory === parentCategory._id && (
                  <ul>
                    {childCategories.map(childCategory => (
                      <CategoryItem
                        key={childCategory._id}
                        category={childCategory}
                        onClick={() => handleCategorySelection(childCategory._id)}
                        isSelected={selectedCategory === childCategory._id}
                      />
                    ))}
                  </ul>
                )}
              </CategoryItem>
            ))}
            </ul></div>
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
