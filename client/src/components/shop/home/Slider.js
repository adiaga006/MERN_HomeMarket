import React, { Fragment, useEffect, useContext, useState } from "react";
import OrderSuccessMessage from "./OrderSuccessMessage";
import { HomeContext } from "./";
import { sliderImages } from "../../admin/dashboardAdmin/Action";
import { prevSlide, nextSlide } from "./Mixins";

const apiURL = process.env.REACT_APP_API_URL;

const Slider = (props) => {
  const { data, dispatch } = useContext(HomeContext);
  const [slide, setSlide] = useState(0);
  const [autoSlide, setAutoSlide] = useState(true);

  useEffect(() => {
    sliderImages(dispatch);
  }, [dispatch]);
  // Tự động chuyển slide
  useEffect(() => {
    let interval;
    if (autoSlide && data?.sliderImages?.length > 1) {
      interval = setInterval(() => {
        nextSlide(data.sliderImages.length, slide, setSlide);
      }, 3000); // Thay đổi slide mỗi 3 giây
    }
    return () => clearInterval(interval); // Hủy khi component unmount
  }, [autoSlide, data?.sliderImages?.length, slide]);

  const slideStyle = {
    transform: `translateX(-${slide * 100}%)`,
  };

  return (
    <Fragment>
      <div className="slider-container mt-16 bg-gray-100 border-2" style={{ height: '650px', width: 'fit-content' }}>
        <div className="slider-wrapper" style={slideStyle}>
          {data.sliderImages.length > 0 &&
            data.sliderImages.map((image, index) => (
              <img
                key={index}
                className="slider-image"
                src={image.slideImage.url}
                alt="sliderImage"
              />
            ))}
        </div>
        {data?.sliderImages?.length > 0 ? (
          <>
            <svg
              onClick={(e) => {
                prevSlide(data.sliderImages.length, slide, setSlide)
                setAutoSlide(false); // Tạm dừng tự động chuyển slide khi người dùng tương tác
              }}
              className={`z-10 absolute top-0 left-0 mt-64 flex justify-end items-center box-border flex justify-center w-12 h-12 text-gray-700  cursor-pointer hover:text-yellow-700`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <svg
              onClick={(e) => {
                nextSlide(data.sliderImages.length, slide, setSlide)
                setAutoSlide(false);
              }}
              className={`z-10 absolute top-0 right-0 mt-64 flex justify-start items-center box-border flex justify-center w-12 h-12 text-gray-700 cursor-pointer hover:text-yellow-700`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <a
                href="./shop"
                style={{ background: "#303031" }}
                className="cursor-pointer box-border text-2xl text-white px-4 py-2 rounded"
              >
                Shop Now
              </a>
            </div>
          </>
        ) : null}
      </div>
      <OrderSuccessMessage />
    </Fragment>
  );
};

export default Slider;
