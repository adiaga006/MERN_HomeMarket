import React, { Fragment, createContext, useReducer } from "react";
import Layout from "../layout";
import Slider from "./Slider";
import ProductCategory from "./ProductCategory";
import { homeState, homeReducer } from "./HomeContext";
import SingleProduct from "./SingleProduct";

import banner1 from "../../../assets/banner1.jpg";
import banner3 from "../../../assets/banner3.jpg";

export const HomeContext = createContext();

const HomeComponent = () => {
  return (
    <Fragment>
      <Slider />
      {/*<section className="m-4 md:mx-8 md:my-6">
        <ProductCategory />
        </section>
        <section className="m-4 md:mx-8 md:my-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <SingleProduct />
        </section>
    */}
      <div className="grid grid-cols-4 bg-white drop-shadow-[0_0_20px_rgba(0,0,0,0.1)] py-6 mb-12">
        <div className="flex justify-center items-center flex-col">
          <svg
            className="w-20 h-20"
            fill="#383634"
            viewBox="0 0 50 50"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
          >
            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
            <g
              id="SVGRepo_tracerCarrier"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></g>
            <g id="SVGRepo_iconCarrier">
              <path d="M2.84375 13C1.285156 13 0 14.285156 0 15.84375L0 42C0 43.660156 1.339844 45 3 45L7.09375 45C7.570313 47.835938 10.035156 50 13 50C15.964844 50 18.429688 47.835938 18.90625 45L28.15625 45C28.894531 45 29.554688 44.6875 30.0625 44.21875C30.582031 44.675781 31.246094 44.992188 32 45L33.09375 45C33.570313 47.835938 36.035156 50 39 50C42.300781 50 45 47.300781 45 44C45 40.699219 42.300781 38 39 38C36.035156 38 33.570313 40.164063 33.09375 43L32 43C31.8125 43 31.527344 42.871094 31.3125 42.65625C31.097656 42.441406 31 42.183594 31 42L31 23C31 22.625 31.625 22 32 22L40 22C40.785156 22 41.890625 22.839844 42.65625 23.75C42.664063 23.761719 42.679688 23.769531 42.6875 23.78125L42.84375 24L38 24C36.40625 24 35 25.289063 35 27L35 31C35 31.832031 35.375 32.5625 35.90625 33.09375C36.4375 33.625 37.167969 34 38 34L48 34L48 42C48 42.375 47.375 43 47 43L45 43L45 45L47 45C48.660156 45 50 43.660156 50 42L50 32.375C50 30.085938 48.40625 28.0625 48.40625 28.0625L48.375 28.0625L44.25 22.5625L44.25 22.53125L44.21875 22.5C43.296875 21.386719 41.914063 20 40 20L32 20C31.644531 20 31.316406 20.074219 31 20.1875L31 15.90625C31 14.371094 29.789063 13 28.1875 13 Z M 2.84375 15L28.1875 15C28.617188 15 29 15.414063 29 15.90625L29 42.15625C29 42.625 28.628906 43 28.15625 43L18.90625 43C18.429688 40.164063 15.964844 38 13 38C10.035156 38 7.570313 40.164063 7.09375 43L3 43C2.625 43 2 42.371094 2 42L2 15.84375C2 15.375 2.367188 15 2.84375 15 Z M 38 26L44.34375 26L46.78125 29.25C46.78125 29.25 47.6875 30.800781 47.875 32L38 32C37.832031 32 37.5625 31.875 37.34375 31.65625C37.125 31.4375 37 31.167969 37 31L37 27C37 26.496094 37.59375 26 38 26 Z M 13 40C15.222656 40 17 41.777344 17 44C17 46.222656 15.222656 48 13 48C10.777344 48 9 46.222656 9 44C9 41.777344 10.777344 40 13 40 Z M 39 40C41.222656 40 43 41.777344 43 44C43 46.222656 41.222656 48 39 48C36.777344 48 35 46.222656 35 44C35 41.777344 36.777344 40 39 40Z"></path>
            </g>
          </svg>
          <div className="mt-4">
            <h1 className="text-primary font-bold text-2xl text-center ">
              Miễn phí giao hàng
            </h1>
            <div className="text-gray-500 font-semibold text-sm mt-2 text-center">
              Được lựa chọn kĩ lưỡng từ <br></br> người bán
            </div>
          </div>
        </div>

        <div className="flex justify-center items-center flex-col">
          <svg
            className="w-20 h-20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
            <g
              id="SVGRepo_tracerCarrier"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></g>
            <g id="SVGRepo_iconCarrier">
              {" "}
              <path
                d="M8.24999 18L5.24999 20.25V15.75H2.25C1.85217 15.75 1.47064 15.5919 1.18934 15.3106C0.908034 15.0293 0.749999 14.6478 0.749999 14.25V2.25C0.749999 1.85217 0.908034 1.47064 1.18934 1.18934C1.47064 0.908034 1.85217 0.749999 2.25 0.749999H18.75C19.1478 0.749999 19.5293 0.908034 19.8106 1.18934C20.0919 1.47064 20.25 1.85217 20.25 2.25V6.71484"
                stroke="#383634"
                strokeWidth="0.9600000000000002"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>{" "}
              <path
                d="M5.24999 5.24999H15.75"
                stroke="#383634"
                strokeWidth="0.9600000000000002"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>{" "}
              <path
                d="M5.24999 9.74999H8.24999"
                stroke="#383634"
                strokeWidth="0.9600000000000002"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>{" "}
              <path
                d="M23.25 18.75H20.25V23.25L15.75 18.75H11.25V9.74999H23.25V18.75Z"
                stroke="#383634"
                strokeWidth="0.9600000000000002"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>{" "}
              <path
                d="M19.5 15H15"
                stroke="#383634"
                strokeWidth="0.9600000000000002"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>{" "}
            </g>
          </svg>

          <div className="mt-4">
            <h1 className="text-primary font-bold text-2xl text-center ">
              Phản hồi tích cực
            </h1>
            <div className="text-gray-500 font-semibold text-sm mt-2 text-center">
              90% khách hàng cảm thấy <br></br> hài lòng & vui vẻ
            </div>
          </div>
        </div>

        <div className="flex justify-center items-center flex-col">
          <svg
            fill="#383634"
            className="w-20 h-20"
            viewBox="0 0 56 56"
            id="Layer_1"
            version="1.1"
            xmlSpace="preserve"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            stroke="#383634"
            strokeWidth="0.00056"
          >
            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
            <g
              id="SVGRepo_tracerCarrier"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></g>
            <g id="SVGRepo_iconCarrier">
              <path d="M49.4,51.1c-5-1.8-9.4-3-13.4-3.8v-3.8c7.2-0.7,12.8-6.8,12.8-14.1c0-7.8-6.4-14.2-14.2-14.2c-1.2,0-2.3,0.1-3.4,0.4 C29.5,8.4,23.5,3,19.3,3C14.5,3,7.1,10.2,7.1,19.2c0,8.5,5,15.4,11.2,16.1v11.1C10,47.6,6.5,51,6.2,51.3c-0.4,0.4-0.4,1,0,1.4 c0.4,0.4,1,0.4,1.4,0c0.1-0.1,10.8-10.6,41,0.2c0.1,0,0.2,0.1,0.3,0.1c0.4,0,0.8-0.3,0.9-0.7C50.2,51.8,49.9,51.2,49.4,51.1z M34.5,17.1c6.7,0,12.2,5.5,12.2,12.2c0,6.3-4.7,11.4-10.8,12.1v-3.6l6.9-6.9c0.4-0.4,0.4-1,0-1.4s-1-0.4-1.4,0L35.9,35V24.9 c0-0.6-0.4-1-1-1s-1,0.4-1,1V35l-3-3c-0.4-0.4-1-0.4-1.4,0s-0.4,1,0,1.4l4.4,4.4v3.6c-4.6-0.2-8.6-3-10.5-7.1 c4.7-2.2,8.1-8.2,8.1-15.2c0-0.6,0-1.1-0.1-1.7C32.5,17.2,33.5,17.1,34.5,17.1z M9.1,19.2C9.1,11.5,15.4,5,19.3,5 s10.3,6.5,10.3,14.2c0,7.3-4.1,13.4-9.3,14.1v-2.5l5.1-5.1c0.4-0.4,0.4-1,0-1.4s-1-0.4-1.4,0l-3.7,3.7v-2.5c0,0,0,0,0,0V22l5.2-5.2 c0.4-0.4,0.4-1,0-1.4s-1-0.4-1.4,0l-3.8,3.8v-4.6c0-0.6-0.4-1-1-1s-1,0.4-1,1v8.3l-4.7-4.7c-0.4-0.4-1-0.4-1.4,0s-0.4,1,0,1.4 l6.1,6.1v7.5C13.1,32.6,9.1,26.5,9.1,19.2z M20.3,46.1V35.3c0.4,0,0.8-0.1,1.2-0.2c2.2,4.9,7,8.2,12.4,8.5v3.4 C28.5,45.9,24,45.8,20.3,46.1z"></path>
            </g>
          </svg>
          <div className="mt-4">
            <h1 className="text-primary font-bold text-2xl text-center ">
              100% tự nhiên
            </h1>
            <div className="text-gray-500 font-semibold text-sm mt-2 text-center">
              Được thực hiện với sự tâm huyết <br></br> của 300+ tuyển trạch
              viên
            </div>
          </div>
        </div>

        <div className="flex justify-center items-center flex-col">
          <svg
            className="w-20 h-20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            stroke="#383634"
          >
            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
            <g
              id="SVGRepo_tracerCarrier"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></g>
            <g id="SVGRepo_iconCarrier">
              <path
                d="M4 21V19.5C4 16.4624 6.46243 14 9.5 14H12.5C15.5376 14 18 16.4624 18 19.5V21M7 21V18M15 21V18M16.5 6L16.8367 5.49493C17.1969 4.95461 17.9371 4.82782 18.4566 5.21745C19.0073 5.63047 19.0645 6.43549 18.5778 6.92224L17.8536 7.64645C17.6272 7.87282 17.5 8.17986 17.5 8.5M17.5 10V10.2M13.8281 4.89801C14.6435 3.74945 15.9842 3 17.5 3C19.9853 3 22 5.01472 22 7.5C22 9.98528 19.9853 12 17.5 12C16.2549 12 15.1279 11.4943 14.3131 10.6771M15 8.00001C15 5.79086 13.2091 4 11 4C8.79086 4 7 5.79086 7 8.00001C7 10.2092 8.79086 12 11 12C11.8312 12 12.6032 11.7465 13.2429 11.3125C14.3033 10.5931 15 9.37794 15 8.00001Z"
                stroke="#383634"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="0.9600000000000002"
              ></path>
            </g>
          </svg>
          <div className="mt-4 text-center">
            <h1 className="text-primary font-bold text-2xl text-center ">
              Dịch vụ 24/7
            </h1>
            <div className="text-gray-500 font-semibold text-sm mt-2 text-center">
              Hỗ trợ trực tuyến 24/7 <br></br> luôn sẵn sàng cho bạn
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-32 w-full h-[500px]" style={{ paddingLeft: '100px', paddingRight: '100px' }}>
        <div className="flex flex-col gap-y-6 items-start max-w-max">
          <div className="">
            <div className="font-bold text-4xl text-primary mb-4">
              Lý do chọn chúng tôi?
            </div>
            <div className="font-medium text-sm text-gray-500 whitespace-normal">
              Mục đích của chúng tôi là tạo ra giải pháp để loại bỏ các rào cản
              ngăn mọi người khỏi việc thực hiện công việc tốt nhất của họ, và
              nó nằm ở trái tim.
            </div>
          </div>

          <div className="flex flex-col gap-y-6">
            <div className="flex justify-center items-center gap-x-4">
              <div className="p-4 bg-gray-50 rounded-md ">
                <svg
                  className="w-10 h-10 "
                  fill="#e45959"
                  viewBox="0 0 32 32"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                  <g
                    id="SVGRepo_tracerCarrier"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></g>
                  <g id="SVGRepo_iconCarrier">
                    {" "}
                    <path d="M29.005 5.5h-26.009c-1.657 0-3 1.343-3 3v15c0 1.657 1.343 3 3 3h26.009c1.657 0 3-1.343 3-3v-15c0-1.657-1.343-3-3-3zM2.995 7.5h26.009c0.552 0 1 0.448 1 1v2h-28.009v-2c0-0.552 0.449-1 1-1zM29.005 24.5h-26.009c-0.552 0-1-0.448-1-1v-9h28.009v9c0 0.552-0.448 1-1 1z"></path>{" "}
                  </g>
                </svg>
              </div>
              <div className="whitespace-normal">
                <h1 className="font-bold text-xl text-primary mb-1">
                  100% Thanh Toán Bảo Mật
                </h1>
                <p className="font-medium text-xs text-gray-500">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua
                </p>
              </div>
            </div>

            <div className="flex justify-center items-center gap-x-4">
              <div className="p-4 bg-gray-50 rounded-md ">
                <svg
                  className="w-10 h-10 "
                  viewBox="0 0 1024 1024"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="#383634"
                >
                  <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                  <g
                    id="SVGRepo_tracerCarrier"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></g>
                  <g id="SVGRepo_iconCarrier">
                    <path
                      fill="#4C7C7D"
                      d="M256 410.304V96a32 32 0 0 1 64 0v314.304a96 96 0 0 0 64-90.56V96a32 32 0 0 1 64 0v223.744a160 160 0 0 1-128 156.8V928a32 32 0 1 1-64 0V476.544a160 160 0 0 1-128-156.8V96a32 32 0 0 1 64 0v223.744a96 96 0 0 0 64 90.56zM672 572.48C581.184 552.128 512 446.848 512 320c0-141.44 85.952-256 192-256s192 114.56 192 256c0 126.848-69.184 232.128-160 252.48V928a32 32 0 1 1-64 0V572.48zM704 512c66.048 0 128-82.56 128-192s-61.952-192-128-192-128 82.56-128 192 61.952 192 128 192z"
                    ></path>
                  </g>
                </svg>
              </div>
              <div className="whitespace-normal">
                <h1 className="font-bold text-xl text-primary mb-1">
                  Giao Hàng Nhanh Chóng
                </h1>
                <p className="font-medium text-xs text-gray-500">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua
                </p>
              </div>
            </div>

            <div className="flex justify-center items-center gap-x-4">
              <div className="p-4 bg-gray-50 rounded-md ">
                <svg
                  className="w-10 h-10 "
                  fill="#e45959"
                  viewBox="0 0 50 50"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                >
                  <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                  <g
                    id="SVGRepo_tracerCarrier"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></g>
                  <g id="SVGRepo_iconCarrier">
                    <path d="M2.84375 13C1.273438 13 0 14.277344 0 15.84375L0 42C0 43.566406 1.429688 45 3 45L7.09375 45C7.570313 47.835938 10.03125 50 13 50C15.96875 50 18.429688 47.835938 18.90625 45L28.15625 45C29.722656 45 31 43.722656 31 42.15625L31 15.90625C31 14.304688 29.738281 13 28.1875 13 Z M 33 20L33 45C33.480469 47.832031 36.03125 50 39 50C41.96875 50 44.429688 47.832031 44.90625 45L47 45C48.570313 45 50 43.570313 50 42L50 32.375C50 30.363281 48.550781 28.308594 48.375 28.0625L44.21875 22.5C43.265625 21.351563 41.769531 20 40 20 Z M 38 25L43.59375 25L46.78125 29.25C47.121094 29.730469 48 31.203125 48 32.375L48 33L38 33C37 33 36 32 36 31L36 27C36 25.894531 37 25 38 25 Z M 13 40C15.207031 40 17 41.792969 17 44C17 46.207031 15.207031 48 13 48C10.792969 48 9 46.207031 9 44C9 41.792969 10.792969 40 13 40 Z M 39 40C41.207031 40 43 41.792969 43 44C43 46.207031 41.207031 48 39 48C36.792969 48 35 46.207031 35 44C35 41.792969 36.792969 40 39 40Z"></path>
                  </g>
                </svg>
              </div>
              <div className="whitespace-normal">
                <h1 className="font-bold text-xl text-primary mb-1">
                  100% Thực Phẩm Tươi & Sạch
                </h1>
                <p className="font-medium text-xs text-gray-500">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua
                </p>
              </div>
            </div>

            <div className="flex justify-center items-center gap-x-4">
              <div className="p-4 bg-gray-50 rounded-md ">
                <svg
                  className="w-10 h-10 "
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  stroke="#4C7C7D"
                  strokeWidth="1.6799999999999997"
                >
                  <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                  <g
                    id="SVGRepo_tracerCarrier"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></g>
                  <g id="SVGRepo_iconCarrier">
                    {" "}
                    <circle
                      cx="12"
                      cy="12"
                      r="9"
                      stroke="#4C7C7D"
                    ></circle>{" "}
                    <path d="M18 18L6 6" stroke="#4C7C7D"></path>{" "}
                  </g>
                </svg>
              </div>
              <div className="whitespace-normal">
                <h1 className="font-bold text-xl text-primary mb-1">
                  Hủy Đơn Mọi Lúc
                </h1>
                <p className="font-medium text-xs text-gray-500">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative w-full h-full rounded-3xl overflow-hidden">
          <img
            className="object-cover h-full rounded-lg overflow-hidden"
            src={banner3}
            alt=""
          />
          <div className="absolute w-full h-full bg-[#383634] top-0 opacity-50"></div>
        </div>
      </div>
      <div className="mt-10">
        <img className="" src={banner1} alt="" />
      </div>
    </Fragment>
  );
};

const Home = (props) => {
  const [data, dispatch] = useReducer(homeReducer, homeState);
  return (
    <Fragment>
      <HomeContext.Provider value={{ data, dispatch }}>
        <Layout children={<HomeComponent />} />
      </HomeContext.Provider>
    </Fragment>
  );
};

export default Home;
