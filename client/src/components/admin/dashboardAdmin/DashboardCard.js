import React, { Fragment, useContext, useEffect,useState } from "react";
import { DashboardContext } from "./";
import { GetAllData } from "./Action";
import{getAllOrder} from "./FetchApi";
import { Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import DatePicker from "react-datepicker";
const DashboardCard = (props) => {
  const { data, dispatch } = useContext(DashboardContext);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [totalAnnualRevenue, setTotalAnnualRevenue] = useState(0);

  useEffect(() => {
    GetAllData(dispatch);
    fetchMonthlyRevenue(selectedYear);
  }, [dispatch, selectedYear]);

  const handleYearChange = (date) => {
    setSelectedYear(date.getFullYear());
  };

  
  const fetchMonthlyRevenue = async (year) => {
    const revenueByMonth = Array(12).fill(0);
    let annualRevenue = 0;

    for (let month = 0; month < 12; month++) {
      let startDate = new Date(year, month, 1);
      let endDate = new Date(year, month + 1, 0);
      let responseData = await getAllOrder();
      let filteredOrders = responseData.Orders.filter(order =>
        order.status !== "Cancelled" &&
        new Date(order.createdAt) >= startDate &&
        new Date(order.createdAt) <= endDate
      );

      for (const order of filteredOrders) {
        for (const product of order.allProduct) {
          const price = product.oldPrice;
          const offer = product.offer;
          const quantity = product.quantitiy;
          const orderTotal = Math.round(price - ((price * offer) / 100)) * quantity;
          revenueByMonth[month] += orderTotal;
          annualRevenue += orderTotal;
        }
      }
    }
    setMonthlyRevenue(revenueByMonth);
    setTotalAnnualRevenue(annualRevenue);
  };

  // Chart data setup
  const chartData = {

    labels: Array.from({ length: 12 }, (_, i) => new Date(0, i).toLocaleString('default', { month: 'long' })),
    datasets: [
      {
        label: 'Monthly Revenue',
        data: monthlyRevenue,
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        borderColor: 'rgba(53, 162, 235, 1)',
        borderWidth: 1,
      }
    ]
  };

  const chartOptions = {
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          // Adjust the callback to correctly reference the `tick` object
          callback: function(value) {
            // Ensure that the value is formatted as a string with "VND"
            return `${value.toLocaleString()},000 VND`;
          }
        }
      }
    },
    plugins: {
      tooltip: {
        // Update tooltip configuration to be under plugins for Chart.js 3
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            // Update how you access the tooltip value using `context.raw`
            label += `${context.raw.toLocaleString()},000 VND`;
            return label;
          }
        }
      }
    },
    tooltips: {
      callbacks: {
        label: function(tooltipItem, data) {
          let label = data.datasets[tooltipItem.datasetIndex].label || '';
          if (label) {
            label += ': ';
          }
          label += `${tooltipItem.yLabel.toLocaleString()},000 VND`;
          return label;
        }
      }
    },
    responsive: true,
    maintainAspectRatio: false
  };
  return (
    <Fragment>
      {/* Card Start */}
      <div className="m-4 grid grid-cols-1 md:grid-cols-4 row-gap-4 col-gap-4">
        <div className="flex flex-col justify-center items-center col-span-1 bg-white p-6 shadow-lg hover:shadow-none cursor-pointer transition-all duration-300 ease-in border-b-4 border-opacity-0 hover:border-opacity-100 border-indigo-200">
          <div className="bg-indigo-200 p-2 cursor-pointer rounded-full" >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
          <div className="text-2xl font-semibold">
            {data ? data.totalData.Users : 0}
          </div>
          <div className="text-lg font-medium">Customers</div>
          <div className="flex items-center space-x-1 text-green-500">
            {/* <span>7%</span>
            <span>
              <svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 10l7-7m0 0l7 7m-7-7v18"
                />
              </svg>
            </span> */}
          </div>
        </div>
        <div className="flex flex-col justify-center items-center col-span-1 bg-white p-6 shadow-lg hover:shadow-none cursor-pointer transition-all duration-300 ease-in border-b-4 border-opacity-0 hover:border-opacity-100 border-red-200">
          <div className="bg-red-200 p-2 cursor-pointer rounded-full">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
              />
            </svg>
          </div>
          <div className="text-2xl font-semibold">
            {data ? data.totalData.Orders : 0}
          </div>
          <div className="text-lg font-medium">Orders</div>
          <div className="flex items-center space-x-1 text-green-500">
            {/* <span>10%</span>
            <span>
              <svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 10l7-7m0 0l7 7m-7-7v18"
                />
              </svg>
            </span> */}
          </div>
        </div>
        <div className="flex flex-col justify-center items-center col-span-1 bg-white p-6 shadow-lg hover:shadow-none cursor-pointer transition-all duration-300 ease-in border-b-4 border-opacity-0 hover:border-opacity-100 border-green-200">
          <div className="bg-green-200 p-2 cursor-pointer rounded-full">
            <svg
              className="w-6 h-6"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="text-2xl font-semibold">
            {data ? data.totalData.Products : 0}
          </div>
          <div className="text-lg font-medium">Product</div>
        </div>
        <div className="flex flex-col justify-center items-center col-span-1 bg-white p-6 shadow-lg hover:shadow-none cursor-pointer transition-all duration-300 ease-in border-b-4 border-opacity-0 hover:border-opacity-100 border-orange-200">
          <div className="bg-orange-200 p-2 cursor-pointer rounded-full">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
          </div>
          <div className="text-2xl font-semibold">
            {data ? data.totalData.Categories : 0}
          </div>
          <div className="text-lg font-medium">Categories</div>
        </div>
         {/* Existing cards... */}
         {/* DatePicker and Total Annual Revenue */}
         <div className="flex justify-between items-center col-span-1 md:col-span-4 bg-white p-6 shadow-lg hover:shadow-none cursor-pointer transition-all duration-300 ease-in border-b-4 border-opacity-0 hover:border-opacity-100 border-blue-200">
         <div className="font-semibold"> 
           <div className="mb-2">Select Year</div>
           <DatePicker
             selected={new Date(selectedYear, 0)}
             onChange={handleYearChange}
             showYearPicker
             dateFormat="yyyy"
             className="datepicker"
           />
         </div>
         <div className="text-right">
           <div className="text-lg font-semibold mb-1">Total Annual Revenue</div>
           <div className="text-xl font-bold">{totalAnnualRevenue.toLocaleString()},000 VND</div>
         </div>
       </div>

       {/* Chart */}
       <div className="col-span-1 md:col-span-4 bg-white p-6 shadow-lg hover:shadow-none cursor-pointer transition-all duration-300 ease-in border-b-4 border-opacity-0 hover:border-opacity-100 border-blue-200">
         <div className="text-xl font-semibold mb-2">Monthly Revenue Chart</div>
         <div className="w-full h-64">
           <Bar data={chartData} options={chartOptions} />
         </div>
       </div>
      </div>
      {/* End Card */}
    </Fragment>
  );
};

export default DashboardCard;