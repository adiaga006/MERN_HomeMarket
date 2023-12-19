export const orderState = {
  orders: [],
  addCategoryModal: false,
  updateOrderModal: {
    modal: false,
    uId: null,
    role: 0,
  },
  loading: false,
};

export const orderReducer = (state, action) => {
  switch (action.type) {
    /* Get all category */
    case "fetchOrderAndChangeState":
      return {
        ...state,
        orders: action.payload,
      };
    /* Create a category */
    case "addCategoryModal":
      return {
        ...state,
        addCategoryModal: action.payload,
      };
    /* Edit a category */
    case "updateOrderModalOpen":
      return {
        ...state,
        updateOrderModal: {
          modal: true,
          uId: action.uId,
          role: action.role,
        },
      };
    case "updateOrderModalClose":
      return {
        ...state,
        updateOrderModal: {
          modal: false,
          uId: null,
          role: 0,
        },
      };
    case "loading":
      return {
        ...state,
        loading: action.payload,
      };
    default:
      return state;
  }
};
