import React from "react";
import {
  Home,
  Shop,
  WishList,
  ProtectedRoute,
  AdminProtectedRoute,
  ShipperProtectedRoute,
  CartProtectedRoute,
  PageNotFound,
  ProductDetails,
  ProductByCategory,
  CheckoutPage,
} from "./shop";
import { DashboardAdmin, Categories, Products, Orders, Users, RedeemPoints, Discounts, ProductStatistics, UserStatistics } from "./admin";
import { UserProfile, UserOrders, UserDiscount, RedeemPoint, SettingUser } from "./shop/dashboardUser";
import { DashboardShipper, Order} from "./shipper"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import ConfirmSignup from "./shop/auth/ConfirmSignup";

/* Routing All page will be here */
const Routes = (props) => {
  return (
    <Router>
      <Switch>
        {/* Shop & Public Routes */}
        <Route exact path="/" component={Home} />
        <Route exact path="/shop" component={Shop} />
        <Route exact path="/wish-list" component={WishList} />
        <Route exact path="/confirm-signup" component={ConfirmSignup} />
        <Route exact path="/products/:id" component={ProductDetails} />
        <Route
          exact
          path="/products/category/:catId"
          component={ProductByCategory}
        />
        <CartProtectedRoute
          exact={true}
          path="/checkout"
          component={CheckoutPage}
        />
        {/* Shop & Public Routes End */}
        
        {/* Shipper Routes */}
        <ShipperProtectedRoute exact={true} path="/shipper/dashboard" component={DashboardShipper} />
        <ShipperProtectedRoute exact={true} path="/shipper/dashboard/orders" component={Order} />
        {/* Shipper Routes End*/}

        {/* Admin Routes */}
        <AdminProtectedRoute
          exact={true}
          path="/admin/dashboard"
          component={DashboardAdmin}
        />
        <AdminProtectedRoute
          exact={true}
          path="/admin/dashboard/categories"
          component={Categories}
        />
        <AdminProtectedRoute
          exact={true}
          path="/admin/dashboard/products"
          component={Products}
        />
        <AdminProtectedRoute
          exact={true}
          path="/admin/dashboard/orders"
          component={Orders}
        />
        <AdminProtectedRoute
          exact={true}
          path="/admin/dashboard/users"
          component={Users}
        />
        <AdminProtectedRoute
          exact={true}
          path="/admin/dashboard/discounts"
          component={Discounts}
        />
        <AdminProtectedRoute
          exact={true}
          path="/admin/dashboard/redeemPoints"
          component={RedeemPoints}
        />
        <AdminProtectedRoute
          exact={true}
          path="/admin/dashboard/productStatistics"
          component={ProductStatistics}
        />
        <AdminProtectedRoute
          exact={true}
          path="/admin/dashboard/userStatistics"
          component={UserStatistics}
        />
        {/* Admin Routes End */}

        {/* User Dashboard */}
        <ProtectedRoute
          exact={true}
          path="/user/profile"
          component={UserProfile}
        />
        <ProtectedRoute
          exact={true}
          path="/user/orders"
          component={UserOrders}
        />
        <ProtectedRoute
          exact={true}
          path="/user/setting"
          component={SettingUser}
        />
        <ProtectedRoute
          exact={true}
          path="/user/redeem"
          component={RedeemPoint}
        />
        <ProtectedRoute
          exact={true}
          path="/user/discount"
          component={UserDiscount}
        />
        {/* User Dashboard End */}

        {/* 404 Page */}
        <Route component={PageNotFound} />
      </Switch>
    </Router>
  );
};

export default Routes;
