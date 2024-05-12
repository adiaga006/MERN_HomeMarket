import React, { useState, useContext } from 'react';
import { HomeContext } from './index';
import { filterAdvance } from "../../admin/products/FetchApi";  // Ensure this is the correct import path

const FilterForm = () => {
  const { dispatch } = useContext(HomeContext);
  const [filters, setFilters] = useState({
    category: '',
    brand: '',
    priceSort: '',
    offerSort: '',
    soldSort: '',
  });

  // Function to apply filters
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

  // Handle changes in filter form inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters(prevFilters => ({ ...prevFilters, [name]: value }));
  };

  return (
    <div className="filter-form">
      <select name="category" value={filters.category} onChange={handleInputChange}>
        <option value="">Select Category</option>
        {/* Dynamic category options would be populated here */}
      </select>

      <select name="brand" value={filters.brand} onChange={handleInputChange}>
        <option value="">Select Brand</option>
        {/* Dynamic brand options would be populated here */}
      </select>

      <select name="priceSort" value={filters.priceSort} onChange={handleInputChange}>
        <option value="">Select Price Sorting</option>
        <option value="asc">Price Low to High</option>
        <option value="desc">Price High to Low</option>
      </select>

      <select name="offerSort" value={filters.offerSort} onChange={handleInputChange}>
        <option value="">Select Offer Sorting</option>
        <option value="asc">Offer Low to High</option>
        <option value="desc">Offer High to Low</option>
      </select>

      <select name="soldSort" value={filters.soldSort} onChange={handleInputChange}>
        <option value="">Select Sales Volume Sorting</option>
        <option value="asc">Sold Low to High</option>
        <option value="desc">Sold High to Low</option>
      </select>

      <button onClick={applyAdvancedFilters}>Apply Filters</button>
    </div>
  );
};

export default FilterForm;
