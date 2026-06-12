import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const PLACEHOLDER = "https://placehold.co/400x300?text=🌍+Trip";

const UserTripCardItem = ({ trip }) => {
  const [photoUrl, setPhotoUrl] = useState(PLACEHOLDER);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!trip) return;

    const fetchPhoto = async () => {
      try {
        const query =
          trip?.userChoice?.location?.label || trip?.userChoice?.location;
        if (!query) return;

        const res = await fetch(
          "https://places.googleapis.com/v1/places:searchText",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-Goog-Api-Key": import.meta.env.VITE_GOOGLE_PLACE_API_KEY,
              "X-Goog-FieldMask": "places.photos",
            },
            body: JSON.stringify({ textQuery: query }),
          }
        );

        const data = await res.json();
        const photoName = data?.places?.[0]?.photos?.[0]?.name;

        if (photoName) {
          setPhotoUrl(
            `https://places.googleapis.com/v1/${photoName}/media?maxHeightPx=600&maxWidthPx=600&key=${import.meta.env.VITE_GOOGLE_PLACE_API_KEY}`
          );
        }
      } catch (err) {
        console.error("Failed to fetch place photo:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPhoto();
  }, [trip]);

  return (
    <Link to={"/view-trip/" + trip?.id}>
      <div className="hover:scale-105 transition-all hover:shadow-md">
        {loading ? (
          <div className="w-full h-48 rounded-t-xl bg-gray-200 dark:bg-gray-700 animate-pulse" />
        ) : (
          <img
            className="w-full h-48 object-cover rounded-t-xl"
            src={photoUrl}
            alt={trip?.userChoice?.location?.label || "Trip"}
          />
        )}
        <h2 className="font-bold text-lg dark:text-white mt-2">
          {trip?.userChoice?.location?.label}
        </h2>
        <h2 className="text-sm text-gray-500 dark:text-gray-400">
          {trip?.userChoice?.noOfDays} days trip with "
          {trip?.userChoice?.budget}" budget.
        </h2>
      </div>
    </Link>
  );
};

export default UserTripCardItem;
