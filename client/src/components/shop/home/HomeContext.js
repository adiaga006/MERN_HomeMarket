export const homeState = {
  categoryListDropdown: false,
  filterListDropdown: false,
  searchDropdown: false,
  products: null,
  loading: false,
  sliderImages: [],
};

export const homeReducer = (state, action) => {
  switch (action.type) {
    case "categoryListDropdown":
      return {
        ...state,
        categoryListDropdown: action.payload,
        filterListDropdown: false,
        searchDropdown: false,
      };
    case "filterListDropdown":
      return {
        ...state,
        categoryListDropdown: false,
        filterListDropdown: action.payload,
        searchDropdown: false,
      };
    case "searchDropdown":
      return {
        ...state,
        categoryListDropdown: false,
        filterListDropdown: false,
        searchDropdown: action.payload,
      };
    case "setProducts":
      return {
        ...state,
        products: action.payload,
      };
      case "searchHandleInReducer":
  return {
    ...state,
    products:
      action.productArray &&
      action.productArray.filter((item) => {
        const productName = item.pName.toUpperCase();
        const searchTerm = action.payload.toUpperCase();
        if (searchTerm.length === 0 || productName.indexOf(searchTerm) !== -1) {
          return item;
        }
        return null;
      }),
  };
    case "loading":
      return {
        ...state,
        loading: action.payload,
      };
    case "sliderImages":
      return {
        ...state,
        sliderImages: action.payload,
      };
      case "SET_PRODUCTS":
  return {
    ...state,
    products: action.payload,
    filterListDropdown: false // Optionally close the filter dropdown
  };
    default:
      return state;
  }
};
