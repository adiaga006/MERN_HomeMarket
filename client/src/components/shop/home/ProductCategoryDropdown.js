import React, { Fragment, useContext, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { HomeContext } from "./index";
import { getAllCategory } from "../../admin/categories/FetchApi";
import { getAllProduct, productByPrice } from "../../admin/products/FetchApi";
import "./style.css";
import { filterAdvance } from "../../admin/products/FetchApi";
import unorm from "unorm";
const apiURL = process.env.REACT_APP_API_URL;
const brands = ["Biên Hòa", "Visaco", "Ajinomoto","Chinsu","Guyumi","Basalco","Knorr","Nam Ngư","Bạc Liêu","Happi Koki","Đầu Bếp Tôm","Simply","Tường An","Việt Hàn","Trần Gia","NT Pearly Food"];

const CategoryList = (props) => {
  const history = useHistory();
  const { data, dispatch } = useContext(HomeContext);
  const [selectedBrand, setSelectedBrand] = useState('');

  const selectBrand = (brand) => {
    setSelectedBrand(brand);
    fetchData(brand);
  };

  const fetchData = async (brand) => {
    dispatch({ type: "loading", payload: true });
    try {
      const filters = { brand }; // Assuming the API expects a 'brand' field
      const data = await filterAdvance(filters);
      if (data.Products && data.Products.length > 0) {
        dispatch({ type: 'SET_PRODUCTS', payload: data.Products });
      } else {
        console.log("No products found for these filters.");
        dispatch({ type: 'SET_PRODUCTS', payload: [] });
      }
    } catch (error) {
      console.error("Error fetching products by brand:", error);
    } finally {
      dispatch({ type: "loading", payload: false });
    }
  };

  const closeDropdown = () => {
    setSelectedBrand(null);
    dispatch({ type: "categoryListDropdown", payload: false });
  };

  return (
    <Fragment>
      <div className={`${data.categoryListDropdown ? "" : "hidden"} my-4 dropdown-content`}>
        <hr />
        <div>
          {brands.map((brand, index) => (
            <div key={index} onClick={() => selectBrand(brand)} className="hover:text-yellow-700 cursor-pointer">
              {brand}
            </div>
          ))}
        </div>
      </div>
    </Fragment>
  );
};

const FilterList = () => {
  const { data, dispatch } = useContext(HomeContext);
  const [range, setRange] = useState(0);

  const rangeHandle = (e) => {
    setRange(e.target.value);
    fetchData(e.target.value);
  };

  const fetchData = async (price) => {
    if (price === "all") {
      try {
        let responseData = await getAllProduct();
        if (responseData && responseData.Products) {
          dispatch({ type: "setProducts", payload: responseData.Products });
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      dispatch({ type: "loading", payload: true });
      try {
        setTimeout(async () => {
          let responseData = await productByPrice(price);
          if (responseData && responseData.Products) {
            console.log(responseData.Products);
            dispatch({ type: "setProducts", payload: responseData.Products });
            dispatch({ type: "loading", payload: false });
          }
        }, 700);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const closeFilterBar = () => {
    fetchData("all");
    dispatch({ type: "filterListDropdown", payload: !data.filterListDropdown });
    setRange(0);
  };

  return (
    <div className={`${data.filterListDropdown ? "" : "hidden"} my-4`}>
      <hr />
      <div className="w-full flex flex-col">
        <div className="font-medium py-2">Filter by price</div>
        <div className="flex justify-between items-center">
          <div className="flex flex-col space-y-2  w-2/3 lg:w-2/4">
            <label htmlFor="points" className="text-sm">
              Price (between 0 and 1 000 000):{" "}
              <span className="font-semibold text-yellow-700">{range}.000 VND</span>{" "}
            </label>
            <input
              value={range}
              className="slider"
              type="range"
              id="points"
              min="0"
              max="1000"
              step="50"
              onChange={(e) => rangeHandle(e)}
            />
          </div>
          <div onClick={(e) => closeFilterBar()} className="cursor-pointer">
            <svg
              className="w-8 h-8 text-gray-700 hover:bg-gray-200 rounded-full p-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};
const removeDiacritics = (str) => {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};
const Search = () => {
  const { data, dispatch } = useContext(HomeContext);
  const [search, setSearch] = useState("");
  const [productArray, setPa] = useState(null);

  const fetchData = async () => {
    dispatch({ type: "loading", payload: true });
    try {
      setTimeout(async () => {
        let responseData = await getAllProduct();
        if (responseData && responseData.Products) {
          setPa(responseData.Products);
          dispatch({ type: "loading", payload: false });
        }
      }, 500);
    } catch (error) {
      console.log(error);
    }
  };
  const searchHandle = (e) => {
    setSearch(e.target.value);
    fetchData();
  };

  useEffect(() => {
    const normalizedSearch = removeDiacritics(search).toLocaleLowerCase();
    const filteredProducts = productArray
      ? productArray.filter((item) =>
        removeDiacritics(item.pName).toLocaleLowerCase().includes(normalizedSearch)
      )
      : null;

    dispatch({
      type: "searchHandleInReducer",
      payload: search,
      productArray: filteredProducts,
    });
  }, [search, productArray, dispatch]);

  const closeSearchBar = () => {
    dispatch({ type: "searchDropdown", payload: !data.searchDropdown });
    fetchData();
    dispatch({ type: "setProducts", payload: productArray });
    setSearch("");
  };

  return (
    <div
      className={`${data.searchDropdown ? "" : "hidden"
        } my-4 flex items-center justify-between`}
    >
      <input
        value={search}
        onChange={(e) => searchHandle(e)}
        className="px-4 text-xl py-4 focus:outline-none"
        type="text"
        placeholder="Search products..."
      />
      <div onClick={(e) => closeSearchBar()} className="cursor-pointer">
        <svg
          className="w-8 h-8 text-gray-700 hover:bg-gray-200 rounded-full p-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </div>
    </div>
  );
};

const ProductCategoryDropdown = (props) => {
  return (
    <Fragment>
      <CategoryList />
      <FilterList />
      <Search />
    </Fragment>
  );
};

export default ProductCategoryDropdown;
