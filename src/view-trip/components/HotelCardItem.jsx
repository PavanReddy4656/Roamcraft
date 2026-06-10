import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CiStar } from "react-icons/ci";

const PLACEHOLDER = "https://placehold.co/400x300?text=Hotel";

const HotelCardItem = ({ h }) => {
  const [photoUrl, setPhotoUrl] = useState(null);

  useEffect(() => {
    if (!h?.name) return;
    const fetchPhoto = async () => {
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
            body: JSON.stringify({ textQuery: h.name }),
          }
        );
        const data = await res.json();
        const photoName = data?.places?.[0]?.photos?.[0]?.name;
        if (photoName) {
          setPhotoUrl(
            `https://places.googleapis.com/v1/${photoName}/media?maxWidthPx=800&key=${import.meta.env.VITE_GOOGLE_PLACE_API_KEY}`
          );
        } else {
          setPhotoUrl(PLACEHOLDER);
        }
      } catch (err) {
        console.error("Error fetching hotel photo:", err);
        setPhotoUrl(PLACEHOLDER);
      }
    };
    fetchPhoto();
  }, [h]);

  return (
    <div>
      <Link
        to={
          "https://www.google.com/maps/search/?api=1&query=" +
          h?.name +
          ", " +
          h?.address
        }
        target="_blank"
      >
        <div className="flex flex-col items-center justify-center">
          {photoUrl === null ? (
            <div className="w-full h-52 rounded-md bg-gray-300 dark:bg-gray-600 animate-pulse" />
          ) : (
            <img className="w-full h-52 rounded-md object-cover" src={photoUrl} alt={h?.name} />
          )}
          <div className="flex w-full items-center justify-between px-2 sm:px-8 mt-2">
            <div className="font-bold truncate mr-2 dark:text-white">{h.name}</div>
            <div className="flex items-center shrink-0 dark:text-gray-300">
              {h.rating}
              <CiStar />
            </div>
          </div>
          <div className="w-full px-2 sm:px-8 my-1 text-md truncate dark:text-gray-300">{h.address}</div>
        </div>
      </Link>
    </div>
  );
};

export default HotelCardItem;
