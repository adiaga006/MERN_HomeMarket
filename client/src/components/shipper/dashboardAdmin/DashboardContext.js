export const dashboardState = {
  totalOrders: []
};

export const dashboardReducer = (state, action) => {
  switch (action.type) {
    case "totalOrders":
      return {
        ...state,
        totalOrders: action.payload,
      };
    default:
      return state;
  }
};
