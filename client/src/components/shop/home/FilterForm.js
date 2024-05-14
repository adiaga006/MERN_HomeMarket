import React, { useState, useContext, useEffect } from 'react';
import { HomeContext } from './index';
import { filterAdvance } from "../../admin/products/FetchApi";
import { getAllCategory } from "../../admin/categories/FetchApi";
import './FilterForm.css'; // Adjust the path based on your project structure

const brands = ["Biên Hòa", "Visaco", "Ajinomoto", "Chinsu", "Guyumi", "Basalco", "Knorr", "Nam Ngư", "Bạc Liêu", "Happi Koki", "Đầu Bếp Tôm", "Simply", "Tường An", "Việt Hàn", "Trần Gia", "NT Pearly Food"];

const FilterForm = () => {
  const { dispatch } = useContext(HomeContext);
  const [filters, setFilters] = useState({
    category: '',
    brand: '',
    priceSort: '',
    offerSort: '',
    soldSort: '',
  });
  const [categories, setCategories] = useState([]);

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

  const applyAdvancedFilters = async () => {
    dispatch({ type: "loading", payload: true });
    const data = await filterAdvance(filters);
    if (data.Products && data.Products.length > 0) {
      dispatch({ type: 'SET_PRODUCTS', payload: data.Products });
    } else {
      console.log("No products found for these filters.");
      dispatch({ type: 'SET_PRODUCTS', payload: [] });
    }
    dispatch({ type: "loading", payload: false });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters(prevFilters => ({ ...prevFilters, [name]: value }));
  };

  const isSortingSelected = filters.priceSort || filters.offerSort || filters.soldSort;

  return (
    <div className="advanced-filter-form">
      <select name="category" value={filters.category} onChange={handleInputChange}>
        <option value="">Select Category</option>
        {categories.map(category => (
          <option key={category._id} value={category._id}>{category.cName}</option>
        ))}
      </select>

      <select name="brand" value={filters.brand} onChange={handleInputChange}>
        <option value="">Select Brand</option>
        {brands.map((brand, index) => (
          <option key={index} value={brand}>{brand}</option>
        ))}
      </select>

      <select name="priceSort" value={filters.priceSort} onChange={handleInputChange} disabled={filters.offerSort || filters.soldSort}>
        <option value="">Sort by Price</option>
        <option value="asc"> Low to High</option>
        <option value="desc"> High to Low</option>
      </select>

      <select name="offerSort" value={filters.offerSort} onChange={handleInputChange} disabled={filters.priceSort || filters.soldSort}>
        <option value="">Sort by Offer</option>
        <option value="asc">Low to High</option>
        <option value="desc">High to Low</option>
      </select>

      <select name="soldSort" value={filters.soldSort} onChange={handleInputChange} disabled={filters.priceSort || filters.offerSort}>
        <option value="">Sort by Sold</option>
        <option value="asc">Low to High</option>
        <option value="desc">High to Low</option>
      </select>

      <button onClick={applyAdvancedFilters}>Apply Filters</button>
    </div>
  );
};

export default FilterForm;
