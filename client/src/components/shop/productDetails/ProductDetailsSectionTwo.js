import React, { Fragment, useContext, useEffect, useState } from "react";
import AllReviews from "./AllReviews";
import ReviewForm from "./ReviewForm";
import { useParams } from "react-router-dom";

import { ProductDetailsContext } from "./";
import { LayoutContext } from "../layout";

import { isAuthenticate } from "../auth/fetchApi";

import "./style.css";
import { checkBuyProduct } from "./Action";

const Menu = () => {
  const { data, dispatch } = useContext(ProductDetailsContext);
  const { data: layoutData } = useContext(LayoutContext);

  return (
    <Fragment>
      <div className="flex flex-col md:flex-row items-center justify-center">
        <div
          onClick={(e) => dispatch({ type: "menu", payload: true })}
          className={`${data.menu ? "border-b-2 border-yellow-700" : ""
            } px-4 py-3 cursor-pointer`}
        >
          Description
        </div>
        <div
          onClick={(e) => dispatch({ type: "menu", payload: false })}
          className={`${!data.menu ? "border-b-2 border-yellow-700" : ""
            } px-4 py-3 relative flex cursor-pointer`}
        >
          <span>Reviews</span>
          <span className="absolute text-xs top-0 right-0 mt-2 bg-yellow-700 text-white rounded px-1">
            {layoutData.singleProductDetail.pRatingsReviews.length}
          </span>
        </div>
      </div>
    </Fragment>
  );
};

const RatingReview = () => {
  let { id } = useParams(); // Product Id
  const [hasBought, setHasBought] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCheckBuyProduct = async () => {
      try {
        const result = await checkBuyProduct(id);
        setHasBought(result);
        console.log(hasBought);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCheckBuyProduct();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Fragment>
      <AllReviews />
      {hasBought && isAuthenticate() ? (
        <ReviewForm />
      ) : (
        <div className="mb-12 md:mx-16 lg:mx-20 xl:mx-24 bg-red-200 px-4 py-2 rounded mb-4">
          {hasBought ? 'You need to login in for review' : 'You need to buy the product to leave a review'}
        </div>
      )}
    </Fragment>
  );
};

const ProductDetailsSectionTwo = (props) => {
  const { data } = useContext(ProductDetailsContext);
  const { data: layoutData } = useContext(LayoutContext);
  const [singleProduct, setSingleproduct] = useState({});

  useEffect(() => {
    setSingleproduct(
      layoutData.singleProductDetail ? layoutData.singleProductDetail : ""
    );
  }, [layoutData.singleProductDetail]);

  // Add this effect to scroll to top when the menu changes
  useEffect(() => {
    // Scroll to the top of the page
    window.scrollTo(0, 0);
  }, []); // This effect runs when data.menu changes

  return (
    <Fragment>
      <section className="m-4 md:mx-12 md:my-8">
        <Menu />
        {data.menu ? (
          <div className="mt-6">{singleProduct.pDescription}</div>
        ) : (
          <RatingReview />
        )}
      </section>
      <div className="m-4 md:mx-8 md:my-6 flex justify-center capitalize font-light tracking-widest bg-white border-t border-b text-gray-800 px-4 py-4 space-x-4">
        <div>
          <span>Category :</span>
          <span className="text-sm text-gray-600">
            {" "}
            {singleProduct.pCategory ? singleProduct.pCategory.cName : ""}
          </span>
        </div>
      </div>
    </Fragment>
  );
};

export default ProductDetailsSectionTwo;
