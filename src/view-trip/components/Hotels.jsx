import React from "react";
import HotelCardItem from "./HotelCardItem";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaAngleRight } from "react-icons/fa6";
const HotelCardSkeleton = () => (
  <div className="p-2">
    <div className="flex flex-col items-center justify-center animate-pulse">
      <div className="w-full h-52 rounded-md bg-gray-300 dark:bg-gray-600" />
      <div className="flex w-full items-center justify-between px-2 sm:px-8 mt-2">
        <div className="h-5 w-32 bg-gray-300 dark:bg-gray-600 rounded" />
        <div className="h-5 w-12 bg-gray-200 dark:bg-gray-700 rounded" />
      </div>
      <div className="w-full px-2 sm:px-8 my-1">
        <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded" />
      </div>
    </div>
  </div>
);

const Hotels = ({ trip, loading }) => {
  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    arrows: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  if (loading) {
    return (
      <div className="mt-12 mx-4 sm:mx-8 md:mx-16 lg:mx-32 p-4 sm:p-6 rounded-lg shadow-lg dark:bg-gray-800">
        <div className="h-7 sm:h-9 w-48 sm:w-72 bg-gray-300 dark:bg-gray-600 rounded mx-auto mb-8 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <HotelCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-12 mx-4 sm:mx-8 md:mx-16 lg:mx-32 p-4 sm:p-6 rounded-lg shadow-lg dark:bg-gray-800 dark:text-white">
      <div className="text-2xl sm:text-4xl font-bold text-center mb-8">
        Hotel Recommendations
      </div>
      <div className="slider-container">
        <Slider {...settings}>
          {trip?.tripData?.hotel?.map((h, i) => (
            <div key={i} className="p-2">
              <HotelCardItem h={h} />
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default Hotels;
