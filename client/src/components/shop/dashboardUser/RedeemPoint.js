import React, { Fragment, useEffect, useContext } from "react";
import moment from "moment";
import { createDiscount, fetchRedeemPoint, generateRandomCode } from "./Action";
import Layout, { DashboardUserContext } from "./Layout";
import { getOrderByUser, getSingleUser, getTotalPoint } from "./FetchApi";

const apiURL = process.env.REACT_APP_API_URL;

const TableHeader = () => {
  return (
    <Fragment>
      <thead>
        <tr>
          <th className="px-4 py-2 border">Điểm</th>
          <th className="px-4 py-2 border">Danh mục sản phẩm</th>
          <th className="px-4 py-2 border">Phương thức</th>
          <th className="px-4 py-2 border">Tiền được giảm</th>
          <th className="px-4 py-2 border">Phần trăm được giảm</th>
          <th className="px-4 py-2 border">Đổi thưởng</th>
        </tr>
      </thead>
    </Fragment>
  );
};

const TableBody = ({ order, points, spendPoints }) => {

  const handleDiscountClick = async () => {
    if (points >= order.rPoint) {
      const confirmRedeem = window.confirm("Bạn chắc chắn dùng điểm thưởng để đổi mã khuyến mãi?");
      if (confirmRedeem) {
        try {
          let dName = generateRandomCode(10)
          const response = await createDiscount({
            dName: dName,
            dMethod : order.rMethod,
            dAmount: order.rAmount,
            dPercent: order.rPercent,
            dCategory: order.rCategory,
            dApply: "Yes",
            dUser: JSON.parse(localStorage.getItem("jwt")).user,
            dStatus: "Active",
            point: spendPoints + order.rPoint
          });
          alert("Points redeemed successfully!");
          window.location.reload()
        } catch (error) {
          console.error(error);
        }
      }
    }
  };

  return (
    <Fragment>
      <tr className="border-b">
        <td className="hover:bg-gray-200 p-2 text-center">{order.rPoint}</td>
        <td className="hover:bg-gray-200 p-2 text-center">{(order.rCategory.cName)}</td>
        <td className="hover:bg-gray-200 p-2 text-center">{order.rMethod}</td>
        <td className="hover:bg-gray-200 p-2 text-center">{order.rAmount}.000 VNĐ</td>
        <td className="hover:bg-gray-200 p-2 text-center">{order.rPercent}%</td>
        {points >= order.rPoint ? (
          <Fragment>
            <div
              onClick={handleDiscountClick}
              style={{ background: "#303031" }}
              className={`px-4 py-2 text-white text-center cursor-pointer uppercase`}
            >
              Đổi điểm ngay
            </div>
          </Fragment>
        ) : (
          <Fragment>
            <div
              style={{ background: "#303031" }}
              disabled={true}
              className="px-4 py-2 text-white opacity-50 cursor-not-allowed text-center uppercase"
            >
              Not Enough Points
            </div>
          </Fragment>
        )}
      </tr>
    </Fragment>
  );
};

const OrdersComponent = () => {
  const { data, dispatch } = useContext(DashboardUserContext);
  const { RedeemPoint: orders } = data;
  const { TotalPoint: totalPoints} = data;
  const { userDetails: user } = data;

  useEffect(() => {
    fetchRedeemPoint(dispatch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  console.log(totalPoints);

  let spendPoints;
  if (user !== null && user.point !== undefined) {
    spendPoints = user.point;
  } else {
    spendPoints = 0;
  }

  let points = totalPoints - spendPoints;
  if (data.loading) {
    return (
      <div className="w-full md:w-9/12 flex items-center justify-center py-24">
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
      <div className="flex flex-col w-full my-4 md:my-0 md:w-9/12 md:px-8">
        <div className="border">
          <div className="py-4 px-4 text-lg font-semibold border-t-2 border-yellow-700">
            Điểm của bạn: {points}
          </div>
          <hr />
          <div className="overflow-auto bg-white shadow-lg p-4">
            <table className="table-auto border w-full my-2">
              <TableHeader />
              <tbody>
                {orders && orders.length > 0 ? (
                  orders.map((item, i) => {
                    return <TableBody key={i} order={item} points={points} spendPoints={spendPoints}  />;
                  })
                ) : (
                  <tr>
                    <td
                      colSpan="8"
                      className="text-xl text-center font-semibold py-8"
                    >
                      Không tìm thấy mã đổi thưởng
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <div className="text-sm text-gray-600 mt-2">
              Total {orders && orders.length} redeem point found
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

const UserOrders = (props) => {
  return (
    <Fragment>
      <Layout children={<OrdersComponent />} />
    </Fragment>
  );
};

export default UserOrders;
