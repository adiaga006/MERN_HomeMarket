import React, { Fragment, useContext, useEffect, useState } from "react";
import moment from "moment";

import { OrderContext } from "./index";
import { fetchData, editOrderReq } from "./Actions";

const apiURL = process.env.REACT_APP_API_URL;

const AllOrders = (props) => {
  const { data, dispatch } = useContext(OrderContext);
  const { orders, loading } = data;
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 6;
  useEffect(() => {
    fetchData(dispatch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // const deleteOrderReq = async (oId) => {
  //   // Your deleteOrderReq function remains the same
  // };

  // const editOrderReq = async (oId, type, status) => {
  //   // Your editOrderReq function remains the same
  // };
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <svg
          className="w-12 h-12 animate-spin text-gray-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          ></path>
        </svg>
      </div>
    );
  }
  return (
    <Fragment>
      <div className="col-span-1 overflow-auto bg-white shadow-lg p-4">
        <table className="table-auto border w-full my-2">
          <thead>
            <tr>
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Email</th>
              <th className="px-4 py-2 border">Phone</th>
              <th className="px-4 py-2 border">Role</th>
              <th className="px-4 py-2 border">Created at</th>
              <th className="px-4 py-2 border">Updated at</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentOrders && currentOrders.length > 0 ? (
              currentOrders.map((item, i) => {
                return (
                  <CategoryTable
                    key={i}
                    order={item}
                    editOrder={(uId, type, role) =>
                      editOrderReq(uId, type, role, dispatch)
                    }
                  />
                );
              })
            ) : (
              <tr>
                <td
                  colSpan="12"
                  className="text-xl text-center font-semibold py-8"
                >
                  No user found
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {/* Pagination */}
        <div className="flex justify-center mt-4">
          {Array.from({ length: Math.ceil(orders.length / ordersPerPage) }).map((_, index) => (
            <button
              key={index}
              className={`mx-1 px-3 py-1 rounded-lg ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              onClick={() => paginate(index + 1)}
            >
              {index + 1}
            </button>
          ))}
        </div>
        <div className="text-sm text-gray-600 mt-2">
          Total {orders && orders.length} order found
        </div>
      </div>
    </Fragment>
  );
};

/* Single Category Component */
const CategoryTable = ({ order, editOrder }) => {
  const { dispatch } = useContext(OrderContext);

  return (
    <Fragment>
      <tr className="border-b">
        <td className="hover:bg-gray-200 p-2 text-center">{order.name}</td>
        <td className="hover:bg-gray-200 p-2 text-center">
          {order.email}
        </td>
        <td className="hover:bg-gray-200 p-2 text-center">{order.phoneNumber}</td>
        <td className="hover:bg-gray-200 p-2 text-center cursor-default">
          {order.userRole === 0 && (
            <span className="hover:bg-gray-200 p-2 text-center">
              User
            </span>
          )}
          {order.userRole === 1 && (
            <span className="hover:bg-gray-200 p-2 text-center">
              Admin
            </span>
          )}
        </td>
        <td className="hover:bg-gray-200 p-2 text-center">
          {moment(order.createdAt).format("lll")}
        </td>
        <td className="hover:bg-gray-200 p-2 text-center">
          {moment(order.updatedAt).format("lll")}
        </td>
        <td className="p-2 flex items-center justify-center">
          <span
            onClick={(e) => editOrder(order._id, true, order.userRole)}
            className="cursor-pointer hover:bg-gray-200 rounded-lg p-2 mx-1"
          >
            <svg
              className="w-6 h-6 fill-current text-green-500"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
              <path
                fillRule="evenodd"
                d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
                clipRule="evenodd"
              />
            </svg>
          </span>
        </td>
      </tr>
    </Fragment>
  );
};

export default AllOrders;
