import React, { Fragment, useContext } from "react";
import { useLocation, useHistory } from "react-router-dom";
import { logout } from "./Action";
import { DashboardUserContext } from "./Layout";
import "./style.css";

const Sidebar = (props) => {
  const { data } = useContext(DashboardUserContext);

  const history = useHistory();
  const location = useLocation();

  return (
    <Fragment>
      <div className="flex flex-col w-full space-y-4 md:w-3/12 font-medium">
        <div
          style={{ background: "#303031" }}
          className="flex items-center space-x-2 rounded shadow p-2 text-gray-100"
        >
          <div className="col-12 col-md-3">
            <figure className='avatar avatar-profile'>
              <img className="rounded-circle img-fluid" src={data.userDetails ? data.userDetails.userImage.url : ""} alt={data.userDetails ? data.userDetails.name : ""} />
            </figure>
            <div className="flex flex-col w-full">
              <span className="text-sm">Hello,               <span className="text-lg">
                {data.userDetails ? data.userDetails.name : ""}
              </span></span>
            </div>
          </div>
        </div>
        <div className="shadow hidden md:block w-full flex flex-col">
          <div
            onClick={(e) => history.push("/user/orders")}
            className={`${
              location.pathname === "/user/orders"
                ? "border-r-4 border-yellow-700 bg-gray-200"
                : ""
            }  px-4 py-4 hover:bg-gray-200 cursor-pointer`}
          >
            My Orders
          </div>
          <hr />
          <div
            onClick={(e) => history.push("/user/profile")}
            className={`${
              location.pathname === "/user/profile"
                ? "border-r-4 border-yellow-700 bg-gray-200"
                : ""
            }  px-4 py-4 hover:bg-gray-200 cursor-pointer`}
          >
            My Accounts
          </div>
          <hr />
          <div
            onClick={(e) => history.push("/wish-list")}
            className={` px-4 py-4 hover:bg-gray-200 cursor-pointer`}
          >
            My Wishlist
          </div>
          <hr />
          <div
            onClick={(e) => history.push("/user/setting")}
            className={`${
              location.pathname === "/user/setting"
                ? "border-r-4 border-yellow-700 bg-gray-200"
                : ""
            }  px-4 py-4 hover:bg-gray-200 cursor-pointer`}
          >
            Setting
          </div>
          <hr />
          <div
            onClick={(e) => logout()}
            className={`${
              location.pathname === "/admin/dashboard/categories"
                ? "border-r-4 border-yellow-700 bg-gray-200"
                : ""
            }  px-4 py-4 hover:bg-gray-200 cursor-pointer`}
          >
            Logout
          </div>
        </div>
      </div>
    </Fragment>
  );
};
export default Sidebar;
