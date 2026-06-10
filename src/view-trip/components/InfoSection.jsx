import { GetPlaceDetails } from "@/service/GlobalApi";
import React, { useEffect, useState } from "react";
import { Share2, Download } from "lucide-react";
import { toast } from "sonner";

const PHOTO_REF_URL =
  "https://places.googleapis.com/v1/{NAME}/media?maxHeightPx=600&maxWidthPx=600&key=" +
  import.meta.env.VITE_GOOGLE_PLACE_API_KEY;
const InfoSectionSkeleton = () => (
  <div className="flex flex-col md:flex-row justify-between items-center mt-12 mx-4 sm:mx-8 md:mx-16 lg:mx-48 p-4 sm:p-6 rounded-lg shadow-lg dark:bg-gray-800 animate-pulse">
    <div className="h-28 w-28 sm:h-40 sm:w-40 rounded-full bg-gray-300 dark:bg-gray-600 shrink-0" />
    <div className="flex flex-col mt-4 md:mt-0 md:ml-6 items-center md:items-end flex-1 space-y-3 w-full">
      <div className="h-6 sm:h-8 w-3/4 bg-gray-300 dark:bg-gray-600 rounded" />
      <div className="h-4 sm:h-5 w-1/2 bg-gray-200 dark:bg-gray-700 rounded" />
      <div className="h-4 sm:h-5 w-1/3 bg-gray-200 dark:bg-gray-700 rounded" />
      <div className="h-4 sm:h-5 w-2/5 bg-gray-200 dark:bg-gray-700 rounded" />
    </div>
  </div>
);

const InfoSection = ({ trip, loading }) => {
  const [photoUrl, setPhotoUrl] = useState();
  useEffect(() => {
    trip && GetPlacePhoto();
  }, [trip]);

  const GetPlacePhoto = async () => {
    const data = {
      textQuery: trip?.userChoice?.location?.label,
    };
    const result = await GetPlaceDetails(data).then((resp) => {
      console.log(resp.data.places[0].photos[3].name);

      const PhotoUrl = PHOTO_REF_URL.replace(
        "{NAME}",
        resp.data.places[0].photos[3].name
      );
      setPhotoUrl(PhotoUrl);
    });
  };
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      toast("Link copied to clipboard! 🔗");
    });
  };

  if (loading) return <InfoSectionSkeleton />;

  return (
    <>
      <style>{`
        @media print {
          header, .no-print { display: none !important; }
          body { background: white !important; color: black !important; -webkit-print-color-adjust: exact; }
          * { box-shadow: none !important; }
          .dark { background: white !important; color: black !important; }
          img { max-width: 120px !important; max-height: 120px !important; }
          h1, h2, h3, h4 { font-size: 16pt !important; color: black !important; }
          p, div, span { color: black !important; font-size: 11pt !important; }
        }
      `}</style>
      <div className="flex flex-col md:flex-row justify-between items-center mt-12 mx-4 sm:mx-8 md:mx-16 lg:mx-48 p-4 sm:p-6 rounded-lg shadow-lg dark:bg-gray-800 dark:text-white">
        <img
          className="h-28 w-28 sm:h-40 sm:w-40 rounded-full object-cover shrink-0"
          src={photoUrl}
          alt="Trip Image"
        />
        <div className="flex flex-col mt-4 md:mt-0 md:ml-6 items-center md:items-end">
          <div className="text-2xl sm:text-4xl font-bold mb-2 flex items-center text-center md:text-right">
            🗺️ {trip?.userChoice?.location?.label}
          </div>
          <div className="text-base sm:text-xl mb-1 flex items-center">
            📅 <span className="font-semibold ml-2">Duration:</span>
            {trip?.userChoice?.noOfDays} days
          </div>
          <div className="text-base sm:text-xl mb-1 flex items-center">
            💰 <span className="font-semibold ml-2">Budget:</span>
            {trip?.userChoice?.budget}
          </div>
          <div className="text-base sm:text-xl flex items-center">
            👥 <span className="font-semibold ml-2">Traveling with:</span>
            {trip?.userChoice?.noOfPeople}
          </div>
          <div className="flex gap-3 mt-4 no-print">
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <Share2 className="w-4 h-4" />
              Share Trip
            </button>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              Download PDF
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default InfoSection;
