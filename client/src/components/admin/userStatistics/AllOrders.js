import React, { Fragment, useContext, useEffect,useState } from "react";
import moment from "moment";

import { OrderContext } from "./index";
import { fetchData, editOrderReq} from "./Actions";

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
              <th className="px-4 py-2 border">Total Amount</th>
            </tr>
          </thead>
          <tbody>
          {currentOrders && currentOrders.length > 0 ? (
            currentOrders.map((item, i) => {
              return (
                <CategoryTable
                  key={i}
                  order={item}
                  editOrder={(oId, type, status) =>
                    editOrderReq(oId, type, status, dispatch)
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
          Total {orders && orders.length} user found
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
        <td className="hover:bg-gray-200 p-2 text-center">{order.email}</td>
        <td className="hover:bg-gray-200 p-2 text-center">
          {order.total}.000 VND
        </td>
      </tr>
    </Fragment>
  );
};

export default AllOrders;
