import React, { Fragment, useContext, useState } from "react";
import ProductCategoryDropdown from "./ProductCategoryDropdown";
import { HomeContext } from "./index";
import FilterForm from './FilterForm';
import { getAllProduct } from "../../admin/products/FetchApi";
import { filterAdvance } from "../../admin/products/FetchApi";
const brands = ["All Categories", "Biên Hòa", "Visaco", "Ajinomoto", "Chinsu", "Guyumi", "Basalco", "Knorr", "Nam Ngư", "Bạc Liêu", "Happi Koki", "Đầu Bếp Tôm", "Simply", "Tường An", "Việt Hàn", "Trần Gia", "NT Pearly Food"];

const ProductCategory = (props) => {
  const { data, dispatch } = useContext(HomeContext);
  const [showFilterForm, setShowFilterForm] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState('');
  const [showBrands, setShowBrands] = useState(false); // State to control visibility of the brand dropdown
  const toggleFilterForm = async () => {
    setShowFilterForm(!showFilterForm);
    if (showFilterForm) {
      // Reset the product filters when hiding the filter form
      let responseData = await getAllProduct();
      if (responseData && responseData.Products) {
        dispatch({ type: "setProducts", payload: responseData.Products });
      }
    }    // Optionally reset any other filter-related states
  };

  const fetchData = async (brand) => {
    dispatch({ type: "loading", payload: true });
    const filters = brand === "All Categories" ? {} : { brand }; // No filter if "All Categories" is selected
    try {
      const data = await filterAdvance(filters);
      if (data.Products && data.Products.length > 0) {
        dispatch({ type: 'SET_PRODUCTS', payload: data.Products });
      } else {
        dispatch({ type: 'SET_PRODUCTS', payload: [] });
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      dispatch({ type: "loading", payload: false });
    }
  };

  const selectBrand = (brand) => {
    setSelectedBrand(brand);
    // Check if the selected brand is 'All Categories'
    if (brand === "All Categories") {
      window.location.reload();  // Reloads the page
    } else {
      fetchData(brand);
    }
  };

  const toggleBrands = () => {
    setShowBrands(!showBrands);
  };
  return (
    <Fragment>
      <div className="flex justify-between font-medium">
        <div
          onClick={() => !showFilterForm && dispatch({
            type: "categoryListDropdown",
            payload: !data.categoryListDropdown,
          })}
          className={`flex items-center space-x-1 cursor-pointer ${data.categoryListDropdown && !showFilterForm ? "text-green-700" : ""
            } ${showFilterForm ? "opacity-50 cursor-not-allowed" : "hover:text-green-700"}`}
        >
          {/* Brand Dropdown */}
          <div className="brand-dropdown" onMouseEnter={toggleBrands} onMouseLeave={toggleBrands}>
            <span className="dropdown-label" style={{ display: 'flex', alignItems: 'center' }}>
              Brand
              <svg
                className="w-4 h-4 text-yellow-700 ml-1"  // Added margin-left for spacing
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </span>
            {showBrands && (
              <div className="dropdown-content">
                {brands.map((brand, index) => (
                  <div key={index} onClick={() => selectBrand(brand)} className="dropdown-item"
                    style={brand === "All Categories" ? { backgroundColor: '#7ABA78', color: 'black' } : null}>
                    {brand}
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
        <div className="flex space-x-2">
          {/* Toggle Filter Form Button */}
          <div onClick={toggleFilterForm} className="flex items-center space-x-2 cursor-pointer">
            <span className="text-md md:text-lg hover:text-green-700">{showFilterForm ? 'Hide Advance Filters' : 'Show Advance Filters'}</span>
            <span>/</span>
          </div>
          <div
            onClick={() => !showFilterForm && dispatch({
              type: "filterListDropdown",
              payload: !data.filterListDropdown,
            })}
            className={`flex items-center space-x-1 cursor-pointer ${data.filterListDropdown && !showFilterForm ? "text-green-700" : ""
              } ${showFilterForm ? "opacity-50 cursor-not-allowed" : "hover:text-green-700"}`}
          >
            <span className="text-md md:text-lg">Filter Price</span>
            <span>
              <svg
                className="w-4 h-4 text-gray-700 text-green-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                ></path>
              </svg>
            </span>
            <span>/</span>
          </div>
          <div
            onClick={() => !showFilterForm && dispatch({
              type: "searchDropdown",
              payload: !data.searchDropdown,
            })}
            className={`flex items-center space-x-1 cursor-pointer ${data.searchDropdown && !showFilterForm ? "text-green-700" : ""
              } ${showFilterForm ? "opacity-50 cursor-not-allowed" : "hover:text-green-700"}`}
          >
            <span className="text-md md:text-lg">Search</span>
            <span>
              <svg
                className="w-4 h-4 text-gray-700 text-green-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                ></path>
              </svg>
            </span>
          </div>
        </div>
      </div>
      {showFilterForm && <FilterForm />}
      <ProductCategoryDropdown />
    </Fragment>
  );
};

export default ProductCategory;
