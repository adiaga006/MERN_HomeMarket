import { getSingleProduct } from "../productDetails/FetchApi";
import React, { Fragment, useState, useEffect, useContext } from "react";

export const addToCart = async (
  id,
  quantitiy,
  price,
  layoutDispatch,
  setQuantitiy,
  setAlertq,
  fetchData,
  totalCost,
  dispatch,
  setPimages
) => {
  try {
    dispatch({ type: "loading", payload: true });
    try {
      let responseData = await getSingleProduct(id);
      setTimeout(() => {
        
        if (responseData.Product) {
          layoutDispatch({
            type: "singleProductDetail",
            payload: responseData.Product,
          }); // Dispatch in layout context
          setPimages(responseData.Product.pImages);
          dispatch({ type: "loading", payload: false });
          layoutDispatch({ type: "inCart", payload: cartList() }); // This function change cart in cart state
        }
        if (responseData.error) {
          console.log(responseData.error);
        }
      }, 500);
    } catch (error) {
      console.log(error);
    }

    let isObj = false;
    let cart = localStorage.getItem("cart")
      ? JSON.parse(localStorage.getItem("cart"))
      : [];

    if (cart.length > 0) {
      for (const item of cart) {
        if (item.id === id) {
          isObj = true;
          break;
        }
      }

      if (!isObj) {
        cart.push({ id, quantitiy, price });
        localStorage.setItem("cart", JSON.stringify(cart));
      }
    } else {
      cart.push({ id, quantitiy, price });
      localStorage.setItem("cart", JSON.stringify(cart));
    }

    layoutDispatch({ type: "inCart", payload: cartList() });
    layoutDispatch({ type: "cartTotalCost", payload: await totalCost() });
    setQuantitiy(1);
    setAlertq(false);
    fetchData()
  } catch (error) {
    console.error("Error in addToCart:", error);
  }
};

export const isWish = (id, wList) => {
  if (wList !== null && wList.includes(id) === true) {
    return true;
  }
  return false;
};

export const isWishReq = (e, id, setWlist) => {
  let list = localStorage.getItem("wishList")
    ? JSON.parse(localStorage.getItem("wishList"))
    : [];
  if (list.length > 0) {
    if (list.includes(id) !== true) {
      list.push(id);
      localStorage.setItem("wishList", JSON.stringify(list));
      setWlist(list);
    }
  } else {
    list.push(id);
    localStorage.setItem("wishList", JSON.stringify(list));
    setWlist(list);
  }
};

export const unWishReq = (e, id, setWlist) => {
  let list = localStorage.getItem("wishList")
    ? JSON.parse(localStorage.getItem("wishList"))
    : [];
  if (list.length > 0) {
    if (list.includes(id) === true) {
      list.splice(list.indexOf(id), 1);
      localStorage.setItem("wishList", JSON.stringify(list));
      setWlist(list);
    }
  }
};

export const nextSlide = (totalImg, slide, setSlide) => {
  if (slide === totalImg - 1) {
    setSlide(0);
  } else if (slide < totalImg) {
    setSlide(slide + 1);
  }
};

export const prevSlide = (totalImg, slide, setSlide) => {
  if (slide === 0) {
    setSlide(totalImg - 1);
  } else if (slide === totalImg - 1) {
    setSlide(0);
  }
};



export const cartList = () => {
  let carts = localStorage.getItem("cart")
    ? JSON.parse(localStorage.getItem("cart"))
    : null;
  let list = [];
  if (carts !== null) {
    for (let cart of carts) {
      list.push(cart.id);
    }
    return list;
  } else {
    return (list = null);
  }
};
