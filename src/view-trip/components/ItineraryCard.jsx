import React, { useEffect, useState } from "react";
import { CiStar } from "react-icons/ci";
import { FaClock, FaMapMarkerAlt } from "react-icons/fa";
import { MdAttachMoney } from "react-icons/md";
import { Link } from "react-router-dom";

const PLACEHOLDER = "https://placehold.co/400x300?text=%F0%9F%93%8D+Place";

const ItineraryCard = ({ plan }) => {
  const [photoUrl, setPhotoUrl] = useState(PLACEHOLDER);
  const [photoLoading, setPhotoLoading] = useState(true);

  useEffect(() => {
    if (!plan?.placeName) {
      setPhotoLoading(false);
      return;
    }
    const fetchPhoto = async () => {
      setPhotoLoading(true);
      try {
        const res = await fetch(
          "https://places.googleapis.com/v1/places:searchText",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-Goog-Api-Key": import.meta.env.VITE_GOOGLE_PLACE_API_KEY,
              "X-Goog-FieldMask": "places.photos",
            },
            body: JSON.stringify({ textQuery: plan.placeName }),
          }
        );
        const data = await res.json();
        const photoName = data?.places?.[0]?.photos?.[0]?.name;
        if (photoName) {
          setPhotoUrl(
            `https://places.googleapis.com/v1/${photoName}/media?maxWidthPx=800&key=${import.meta.env.VITE_GOOGLE_PLACE_API_KEY}`
          );
        }
      } catch (err) {
        console.error("Error fetching place photo:", err);
      } finally {
        setPhotoLoading(false);
      }
    };
    fetchPhoto();
  }, [plan]);

  return (
    <Link
      to={
        "https://www.google.com/maps/search/?api=1&query=" +
        plan?.placeName +
        ", "
      }
      target="_blank"
    >
      <div className="flex flex-col bg-white dark:bg-gray-700 rounded-lg shadow-md overflow-hidden transition-transform transform hover:scale-105 duration-300 itinerary-card min-h-[360px]">
        {photoLoading ? (
          <div className="w-full h-48 bg-gray-300 dark:bg-gray-600 animate-pulse shrink-0" />
        ) : (
          <img
            className="w-full h-48 object-cover shrink-0"
            src={photoUrl}
            alt={plan.placeName}
          />
        )}
        <div className="p-4">
          <h4 className="text-xl font-semibold mb-2 flex items-center dark:text-white">
            <FaMapMarkerAlt className="text-blue-500 mr-2" />
            {plan.placeName}
          </h4>
          <p className="flex items-center text-md mb-2 text-gray-700 dark:text-gray-300">
            <CiStar className="text-yellow-500 mr-1" />
            {plan.rating}
          </p>
          <p className="flex items-center text-md mb-1 text-gray-600 dark:text-gray-400">
            <MdAttachMoney className="text-green-500 mr-1" />
            Ticket Pricing: {plan.ticketPricing}
          </p>
          <p className="flex items-center text-md mb-1 text-gray-600 dark:text-gray-400">
            <FaClock className="text-gray-500 dark:text-gray-400 mr-1" />
            Travel Time: {plan.timeTravel}
          </p>
          <p className="text-md text-gray-600 dark:text-gray-400 truncate">{plan.placeDetails}</p>
        </div>
      </div>
    </Link>
  );
};

export default ItineraryCard;
