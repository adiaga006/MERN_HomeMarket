import React, { useState, useContext } from 'react';
import axios from 'axios'; // Make sure to install axios for making HTTP requests
import { HomeContext } from './index';

const FilterForm = () => {
  const { dispatch } = useContext(HomeContext);
  const [filters, setFilters] = useState({
    category: '',
    brand: '',
    priceSort: '', // 'asc' or 'desc'
    offerSort: '', // 'asc' or 'desc'
    soldSort: '', // 'asc' or 'desc'
  });
  const apiURL = process.env.REACT_APP_API_URL;
  const applyFilters = async () => {
    try {
      const response = await axios.get(`${apiURL}/api/product/filter`, { params: { ...filters } });
      if (response.data && response.data.Products.length > 0) {
        dispatch({ type: 'SET_PRODUCTS', payload: response.data.Products });
      } else {
        console.log("No products found for these filters.");
        // Optionally, dispatch an action to clear the products list or show a message
      }
    } catch (error) {
      console.error('Failed to fetch filtered products:', error);
      // Handle error appropriately, such as showing a user-friendly message
    }
  };
  
  return (
    <div className="filter-form">
      <select
        value={filters.category}
        onChange={(e) => setFilters({ ...filters, category: e.target.value })}
      >
        <option value="">Select Category</option>
        {/* Replace the following options with dynamic category options */}
        <option value="">{filters.category.cName}</option>
        {/* ... other categories */}
      </select>

      <select
        value={filters.brand}
        onChange={(e) => setFilters({ ...filters, brand: e.target.value })}
      >
        <option value="">Select Brand</option>
        {/* Replace the following options with dynamic brand options */}
        <option value="samsung">Samsung</option>
        <option value="apple">Apple</option>
        {/* ... other brands */}
      </select>

      <select
        value={filters.priceSort}
        onChange={(e) => setFilters({ ...filters, priceSort: e.target.value })}
      >
        <option value="">Select Price Sorting</option>
        <option value="asc">Price Low to High</option>
        <option value="desc">Price High to Low</option>
      </select>

      <select
        value={filters.offerSort}
        onChange={(e) => setFilters({ ...filters, offerSort: e.target.value })}
      >
        <option value="">Select Offer Sorting</option>
        <option value="asc">Offer Low to High</option>
        <option value="desc">Offer High to Low</option>
      </select>

      <select
        value={filters.soldSort}
        onChange={(e) => setFilters({ ...filters, soldSort: e.target.value })}
      >
        <option value="">Select Sales Volume Sorting</option>
        <option value="asc">Sold Low to High</option>
        <option value="desc">Sold High to Low</option>
      </select>

      <button onClick={applyFilters}>Apply Filters</button>
    </div>
  );
};

export default FilterForm;
