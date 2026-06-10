import React from "react";
import ItineraryCard from "./ItineraryCard";
import { gsap } from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const ItineraryCardSkeleton = () => (
  <div className="flex flex-col bg-white dark:bg-gray-700 rounded-lg shadow-md overflow-hidden animate-pulse">
    <div className="w-full h-48 bg-gray-300 dark:bg-gray-600" />
    <div className="p-4 space-y-3">
      <div className="h-5 w-3/4 bg-gray-300 dark:bg-gray-500 rounded" />
      <div className="h-4 w-16 bg-gray-200 dark:bg-gray-600 rounded" />
      <div className="h-4 w-40 bg-gray-200 dark:bg-gray-600 rounded" />
      <div className="h-4 w-32 bg-gray-200 dark:bg-gray-600 rounded" />
      <div className="h-4 w-full bg-gray-100 dark:bg-gray-600 rounded" />
    </div>
  </div>
);

const ItineraryDaySkeleton = () => (
  <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg animate-pulse">
    <div className="h-7 w-24 bg-gray-300 dark:bg-gray-600 rounded mb-4" />
    <div className="space-y-6">
      {[1, 2].map((i) => (
        <ItineraryCardSkeleton key={i} />
      ))}
    </div>
  </div>
);

const Itinerary = ({ trip, loading }) => {
  if (loading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 w-full sm:w-4/5">
        <div className="h-7 sm:h-9 w-40 sm:w-56 bg-gray-300 dark:bg-gray-600 rounded mx-auto mb-8 animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5].map((i) => (
            <ItineraryDaySkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 w-full sm:w-4/5">
      <h2 className="text-2xl sm:text-4xl font-bold text-center mb-8 dark:text-white">Places to Visit</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
        {trip?.tripData?.itinerary.map((item, i) => (
          <div
            key={i}
            className="itinerary-card p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg"
          >
            <h3 className="text-2xl font-semibold mb-4 dark:text-white">{item?.day}</h3>
            <div className="space-y-6">
              {item?.plan?.map((plan, index) => (
                <ItineraryCard plan={plan} key={index} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Itinerary;
