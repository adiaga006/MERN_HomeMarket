export const categoryState = {
  categories: [],
  addCategoryModal: false,
  editCategoryModal: {
    modal: false,
    dId: null,
    name: "",
    method: "",
    amount: "",
    percent: "",
    category: "",
    apply: "",
    status: "",
  },
  loading: false,
};

export const categoryReducer = (state, action) => {
  switch (action.type) {
    /* Get all category */
    case "fetchCategoryAndChangeState":
      return {
        ...state,
        categories: action.payload,
      };
    /* Create a category */
    case "addCategoryModal":
      return {
        ...state,
        addCategoryModal: action.payload,
      };
    /* Edit a category */
    case "editCategoryModalOpen":
      return {
        ...state,
        editCategoryModal: {
          modal: true,
          dId: action.dId,
          name: action.name,
          method: action.method,
          amount: action.amount,
          percent: action.percent,
          category: action.category,
          apply: action.apply,
          status: action.status,
        },
      };
    case "editCategoryModalClose":
      return {
        ...state,
        editCategoryModal: {
          modal: false,
          dId: null,
          name: "",
          method: "",
          amount: "",
          percent: "",
          category: "",
          apply: "",
          status: "",
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
