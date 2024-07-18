import React from "react";
import { Route, Redirect } from "react-router-dom";
import { isAuthenticate, isShipper } from "./fetchApi";

const ShipperProtectedRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      isShipper() && isAuthenticate() ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: "/user/profile",
            state: { from: props.location },
          }}
        />
      )
    }
  />
);

export default ShipperProtectedRoute;
