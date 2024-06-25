import React, { Fragment, useContext, useEffect, useState } from "react";
import { deleteCategory, getAllDiscount_Admin } from "./FetchApi";
import { CategoryContext } from "./index";
import moment from "moment";

const AllCategory = (props) => {
  const { data, dispatch } = useContext(CategoryContext);
  const { categories, loading } = data;
  const [currentPage, setCurrentPage] = useState(1);
  const categoriesPerPage = 10;

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const fetchData = async () => {
    dispatch({ type: "loading", payload: true });
    let responseData = await getAllDiscount_Admin();
    setTimeout(() => {
      if (responseData && responseData.Discounts) {
        dispatch({
          type: "fetchCategoryAndChangeState",
          payload: responseData.Discounts,
        });
        dispatch({ type: "loading", payload: false });
      }
    }, 1000);
  };

  const deleteCategoryReq = async (dId) => {
    let deleteC = await deleteCategory(dId);
    if (deleteC.error) {
      console.log(deleteC.error);
    } else if (deleteC.success) {
      alert(deleteC.success);
      fetchData();
    }
  };

  /* This method call the editmodal & dispatch category context */
  const editCategory = (dId, name, type, method, amount, percent, category, apply, status) => {
    if (type) {
      dispatch({
        type: "editCategoryModalOpen",
        dId: dId,
        name: name,
        method: method,
        amount: amount,
        percent: percent,
        category: category,
        apply: apply,
        status: status,
      });
    }
  };
  const indexOfLastCategory = currentPage * categoriesPerPage;
  const indexOfFirstCategory = indexOfLastCategory - categoriesPerPage;
  const currentCategories = categories.slice(
    indexOfFirstCategory,
    indexOfLastCategory
  );

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
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          ></path>
        </svg>
      </div>
    );
  }

  return (
    <Fragment>
      <div className="col-span-1 custom-width-class overflow-auto bg-white shadow-lg p-4">
        <table className="table-auto border w-full my-2">
          <thead>
            <tr>
              <th className="px-4 py-2 border">Code</th>
              <th className="px-4 py-2 border">Method</th>
              <th className="px-4 py-2 border">Amount</th>
              <th className="px-4 py-2 border">Percent</th>
              <th className="px-4 py-2 border">Category</th>
              <th className="px-4 py-2 border">Apply</th>
              <th className="px-4 py-2 border">Status</th>
              <th className="px-4 py-2 border">Created at</th>
              <th className="px-4 py-2 border">Updated at</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentCategories && currentCategories.length > 0 ? (
              currentCategories.map((item, key) => {
                return (
                  <CategoryTable
                    category={item}
                    editCat={(dId, name, type, method, amount, percent, category, apply, status) =>
                      editCategory(dId, name, type, method, amount, percent, category, apply, status)
                    }
                    deleteCat={(dId) => deleteCategoryReq(dId)}
                    key={key}
                  />
                );
              })
            ) : (
              <tr>
                <td
                  colSpan="9"
                  className="text-xl text-center font-semibold py-8"
                >
                  No discount found
                </td>
              </tr>
            )}
          </tbody>
          {/* Pagination */}
        </table>
        <div className="flex justify-center mt-4">
          {Array.from({ length: Math.ceil(categories.length / categoriesPerPage) }).map((_, index) => (
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
          Total {categories && categories.length} discount found
        </div>
      </div>
    </Fragment>
  );
};

/* Single Category Component */
const CategoryTable = ({ category, deleteCat, editCat }) => {
  return (
    <Fragment>
      <tr>
        <td className="p-2 text-left">
          {category.dName.length > 20
            ? category.dName.slice(0, 20) + "..."
            : category.dName}
        </td>
        <td className="p-2 text-center">
          {category.dStatus === "Amount" ? (
            <span className="bg-green-200 rounded-full text-center text-xs px-2 font-semibold">
              {category.dMethod}
            </span>
          ) : (
            <span className="bg-red-200 rounded-full text-center text-xs px-2 font-semibold">
              {category.dMethod}
            </span>
          )}
        </td>
        <td className="hover:bg-gray-200 p-2 text-center">
          {category.dAmount}.000 VND
        </td>
        <td className="hover:bg-gray-200 p-2 text-center">
          {category.dPercent} %
        </td>
        <td className="p-2 text-center">{category.dCategory.cName}</td>
        <td className="p-2 text-center">
          {category.dApply === "Yes" ? (
            <span className="bg-green-200 rounded-full text-center text-xs px-2 font-semibold">
              {category.dApply}
            </span>
          ) : (
            <span className="bg-red-200 rounded-full text-center text-xs px-2 font-semibold">
              {category.dApply}
            </span>
          )}
        </td>
        <td className="p-2 text-center">
          {category.dStatus === "Active" ? (
            <span className="bg-green-200 rounded-full text-center text-xs px-2 font-semibold">
              {category.dStatus}
            </span>
          ) : (
            <span className="bg-red-200 rounded-full text-center text-xs px-2 font-semibold">
              {category.dStatus}
            </span>
          )}
        </td>
        <td className="p-2 text-center">
          {moment(category.createdAt).format("lll")}
        </td>
        <td className="p-2 text-center">
          {moment(category.updatedAt).format("lll")}
        </td>
        <td className="p-2 flex items-center justify-center">
          <span
            onClick={(e) =>
              editCat(
                category._id,
                category.dName,
                true,
                category.dMethod,
                category.dAmount,
                category.dPercent,
                category.dCategory,
                category.dApply,
                category.dStatus
              )
            }
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
          <span
            onClick={(e) => deleteCat(category._id)}
            className="cursor-pointer hover:bg-gray-200 rounded-lg p-2 mx-1"
          >
            <svg
              className="w-6 h-6 fill-current text-red-500"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </span>
        </td>
      </tr>
    </Fragment>
  );
};

export default AllCategory;
