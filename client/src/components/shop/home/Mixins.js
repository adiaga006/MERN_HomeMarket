import { getSingleProduct } from "../productDetails/FetchApi";
import { cartList } from "../productDetails/Mixins"

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

export const quantityCartItem = (id) => {
  let carts = localStorage.getItem("cart")
    ? JSON.parse(localStorage.getItem("cart"))
    : null;

  if (carts !== null) {
    for (let cart of carts) {
      if (cart.id === id) {
        return cart.quantitiy;
      }
    }
  }
};

export const updateQuantityCartItem = (id, quantity, layoutDispatch, fetchData) => {
  let carts = localStorage.getItem("cart")
    ? JSON.parse(localStorage.getItem("cart"))
    : null;

  if (carts !== null) {
    for (let i = 0; i < carts.length; i++) {
      if (carts[i].id === id) {
        if (quantity === 0) {
          carts.splice(i, 1);
        } else {
          // Cập nhật số lượng mới
          carts[i].quantitiy = quantity;
        }
        localStorage.setItem("cart", JSON.stringify(carts));
        layoutDispatch({ type: "inCart", payload: cartList() });
        fetchData();
      }
    }
  }
}
