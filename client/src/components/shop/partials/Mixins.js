export const subTotal = (id, price) => {
  let subTotalCost = 0;
  let carts = JSON.parse(localStorage.getItem("cart"));
  let discounts = JSON.parse(localStorage.getItem("discount"));
  carts.forEach((item) => {
    if (item.id === id) {
      subTotalCost = item.quantitiy * price;
      if (discounts != null) {
        discounts.forEach((discount) => {
          if (item.category._id === discount.category) {
            if (discount.method === "Percent") {
              subTotalCost *= (1 - (discount.percent / 100));
            }
          }
        });
      }
    }
  });
  if (subTotalCost < 0) {
    subTotalCost = 0;
  }
  return subTotalCost;
};

export const quantity = (id) => {
  let quantity = 0;
  let carts = JSON.parse(localStorage.getItem("cart"));
  carts.forEach((item) => {
    if (item.id === id) {
      quantity = item.quantitiy;
    }
  });
  return quantity;
};

export const totalCost = () => {
  let totalCost = 0;
  let categoryTotalCost = 0;
  let subTotalCost = 0;
  let carts = JSON.parse(localStorage.getItem("cart"));
  let discounts = JSON.parse(localStorage.getItem("discount"));

  let uniqueCategories = [];
  let usedDiscounts = [];
  carts.forEach((item) => {
    let categoryID = item.category._id;
    if (!uniqueCategories.includes(categoryID)) {
      uniqueCategories.push(categoryID);
    }
  });

  uniqueCategories.forEach((categoryID) => {
    carts.forEach((item) => {
      if (item.category._id === categoryID) {
        subTotalCost = item.quantitiy * item.price;
        if (discounts != null) {
          discounts.forEach((discount) => {
            if (item.category._id === discount.category) {
              if (discount.method === "Percent") {
                subTotalCost *= (1 - (discount.percent / 100));
                // Đảm bảo subTotalCost không âm
                subTotalCost = Math.max(subTotalCost, 0)
                if (!usedDiscounts.includes(discount)) {
                  usedDiscounts.push(discount)
                }
              }
            }
          });
        }
        categoryTotalCost += subTotalCost;
      }
    });
    if (discounts != null) {
      discounts.forEach((discount) => {
        if (categoryID === discount.category) {
          if (discount.method === "Amount") {
            categoryTotalCost -= discount.amount;
            categoryTotalCost = Math.max(categoryTotalCost, 0)
            if (!usedDiscounts.includes(discount)) {
              usedDiscounts.push(discount)
            }
          }
        }
      });
    }
    totalCost += categoryTotalCost;
    categoryTotalCost = 0;
  });
  if (discounts != null) {
    let updatedDiscounts = discounts.filter(discount => usedDiscounts.includes(discount));
    localStorage.setItem("discount", JSON.stringify(updatedDiscounts));
  }
  return totalCost;
};

export const addToCart = (
  id,
  category,
  method,
  amount,
  percent,
) => {
  let isObj = false;
  let discount = localStorage.getItem("discount")
? JSON.parse(localStorage.getItem("discount"))
    : [];
  if (discount.length > 0) {
    discount.forEach((item) => {
      if (item.id === id) {
        isObj = true;
      }
    });
    if (!isObj) {
      discount.push({ id, category, method, amount, percent });
      localStorage.setItem("discount", JSON.stringify(discount));
    }
  } else {
    discount.push({ id, category, method, amount, percent });
    localStorage.setItem("discount", JSON.stringify(discount));
  }
};