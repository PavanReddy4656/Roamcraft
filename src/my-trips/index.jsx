import { db } from "@/service/firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserTripCardItem from "./components/UserTripCardItem";

const TripCardSkeleton = () => (
  <div className="animate-pulse">
    <div className="w-full h-64 rounded-xl bg-gray-300 dark:bg-gray-600" />
    <div className="mt-2 space-y-2">
      <div className="h-5 w-3/4 bg-gray-300 dark:bg-gray-600 rounded" />
      <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded" />
    </div>
  </div>
);

const MyTrips = () => {
  const navigate = useNavigate();
  const [userTrips, setUserTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      navigate("/");
    }
  }, [navigate]);

  const GetUserTrips = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return;

    setLoading(true);
    const q = query(
      collection(db, "AITrips"),
      where("userEmail", "==", user?.email)
    );
    setUserTrips([]);
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());
      setUserTrips((prevVal) => [...prevVal, doc.data()]);
    });
    setLoading(false);
  };

  useEffect(() => {
    GetUserTrips();
  }, []);

  return (
    <div className="p-4 sm:p-10 md:px-20 lg:px-36 dark:bg-gray-900 min-h-screen">
      <h2 className="font-bold text-2xl sm:text-4xl text-center dark:text-white">My Trips</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 mt-10 gap-5">
        {loading
          ? [1, 2, 3, 4, 5, 6].map((i) => <TripCardSkeleton key={i} />)
          : userTrips.map((trip, index) => (
              <UserTripCardItem trip={trip} key={index} />
            ))}
      </div>
    </div>
  );
};

export default MyTrips;
