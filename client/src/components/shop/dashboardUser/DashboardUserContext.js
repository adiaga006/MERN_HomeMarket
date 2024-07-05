import { RedeemPoint } from ".";

export const dashboardUserState = {
  userDetails: null,
  loading: false,
  OrderByUser: null,
  DiscountByUser: null,
  RedeemPoint: null,
  TotalPoint: 0,
};

export const dashboardUserReducer = (state, action) => {
  switch (action.type) {
    case "userDetails":
      return {
        ...state,
        userDetails: action.payload,
      };
    case "OrderByUser":
      return {
        ...state,
        OrderByUser: action.payload,
      };
    case "DiscountByUser":
      return {
        ...state,
        DiscountByUser: action.payload,
      };
    case "RedeemPoint":
      return {
        ...state,
        RedeemPoint: action.payload,
      };
    case "TotalPoint":
      return {
        ...state,
        TotalPoint: action.payload,
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
