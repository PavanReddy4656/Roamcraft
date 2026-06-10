import React, { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import {
  AI_PROMPT,
  SelectBudgetOptions,
  SelectTravelList,
} from "@/constants/options";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { chatSession } from "@/service/AIModel";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useGoogleLogin } from "@react-oauth/google";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/service/firebaseConfig";
import { useNavigate } from "react-router-dom";

const LOADING_MESSAGES = [
  "🗺️ Mapping your adventure...",
  "🏨 Finding perfect hotels...",
  "🎯 Crafting your itinerary...",
  "✨ Almost ready...",
];

const CreateTrip = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingMsgIndex, setLoadingMsgIndex] = useState(0);
  const [formData, setFormData] = useState([]);
  const navigate = useNavigate();
  const debounceTimer = useRef(null);
  const suggestionsRef = useRef(null);

  const handleInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  useEffect(() => {
    document.title = "RoamCraft — Plan Your Trip";
  }, []);

  useEffect(() => {
    console.log(formData);
  }, [formData]);

  useEffect(() => {
    if (!loading) return;
    setLoadingMsgIndex(0);
    const interval = setInterval(() => {
      setLoadingMsgIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 1500);
    return () => clearInterval(interval);
  }, [loading]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchSuggestions = useCallback(async (input) => {
    if (!input || input.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    try {
      const res = await fetch(
        "https://places.googleapis.com/v1/places:autocomplete",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Goog-Api-Key": import.meta.env.VITE_GOOGLE_PLACE_API_KEY,
          },
          body: JSON.stringify({ input }),
        }
      );
      const data = await res.json();
      const items = (data.suggestions || [])
        .filter((s) => s.placePrediction)
        .map((s) => ({
          label: s.placePrediction.text.text,
          placeId: s.placePrediction.placeId,
        }));
      setSuggestions(items);
      setShowSuggestions(items.length > 0);
    } catch (err) {
      console.error("Autocomplete fetch error:", err);
    }
  }, []);

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => fetchSuggestions(val), 300);
  };

  const handleSuggestionClick = (item) => {
    setSearchQuery(item.label);
    setSuggestions([]);
    setShowSuggestions(false);
    handleInputChange("location", item);
  };

  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => GetUserProfile(tokenResponse),
    onError: (error) => console.log(error),
  });

  const onGenerateTrip = async () => {
    const user = localStorage.getItem("user");

    if (!user) {
      setOpenDialog(true);
      return;
    }

    if (formData?.noOfDays > 7) {
      toast("Please enter no. of days less than 8");
      return;
    }
    if (
      !formData?.noOfDays ||
      !formData?.location ||
      !formData?.budget ||
      !formData?.noOfPeople
    ) {
      toast("Please enter all the details");
      return;
    }
    setLoading(true);
    const FINAL_PROMPT = AI_PROMPT.replace(
      "{location}",
      formData?.location?.label
    )
      .replace("{totalDays}", formData?.noOfDays)
      .replace("{traveler}", formData?.noOfPeople)
      .replace("{budget}", formData?.budget)
      .replace("{totalDays}", formData?.noOfDays);

    const result = await chatSession.sendMessage(FINAL_PROMPT);
    console.log("--", result?.response?.text());
    setLoading(false);
    SaveAiTrip(result?.response?.text());
  };

  const GetUserProfile = (tokenInfo) => {
    axios
      .get(
        `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo.access_token}`,
        {
          headers: {
            Authorization: `Bearer ${tokenInfo.access_token}`,
            Accept: "application/json",
          },
        }
      )
      .then((resp) => {
        console.log(resp.data);
        localStorage.setItem("user", JSON.stringify(resp.data));
        setOpenDialog(false);
        onGenerateTrip();
      })
      .catch((error) => {
        console.error("Error fetching user profile:", error);
      });
  };

  const SaveAiTrip = async (TripData) => {
    setLoading(true);
    let parsed;
    try {
      parsed = JSON.parse(TripData);
    } catch (e) {
      console.error("Failed to parse AI response:", e);
      toast("Trip generation failed, please try again");
      setLoading(false);
      return;
    }
    const user = JSON.parse(localStorage.getItem("user"));
    const docId = Date.now().toString();
    await setDoc(doc(db, "AITrips", docId), {
      userChoice: formData,
      tripData: parsed,
      userEmail: user?.email,
      id: docId,
    });
    navigate("/view-trip/" + docId);
  };

  return (
    <>
      <style>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animated-gradient-bg {
          background: linear-gradient(-45deg, #dbeafe, #e0e7ff, #ede9fe, #dbeafe);
          background-size: 400% 400%;
          animation: gradientShift 8s ease infinite;
        }
        .dark .animated-gradient-bg {
          background: linear-gradient(-45deg, #1e1b4b, #1e3a5f, #312e81, #1e1b4b);
          background-size: 400% 400%;
          animation: gradientShift 8s ease infinite;
        }
      `}</style>
    <div className="animated-gradient-bg flex flex-col justify-center items-center min-h-screen py-8 px-4">
      {/* Heading */}
      <div className="mt-8 text-center w-full max-w-2xl">
        <h1 className="font-bold text-blue-900 dark:text-blue-300 text-2xl sm:text-4xl mb-2 flex items-center justify-center gap-2">
          Plan Your Perfect Trip
          <span className="inline-block animate-bounce">✈️</span>
        </h1>
        <p className="text-purple-600 dark:text-purple-400 text-sm sm:text-base font-medium mb-2">
          Powered by AI — personalized just for you
        </p>
        <p className="text-gray-700 dark:text-gray-300 text-base sm:text-lg mb-8">
          Tell us your travel preferences and we'll craft the perfect trip for
          you in seconds.
        </p>
      </div>

      {/* Destination Choice */}
      <div className="flex flex-col w-full max-w-2xl mb-8">
        <label className="text-black dark:text-white text-xl sm:text-2xl font-semibold mb-2">
          What is your Destination?
        </label>
        <div className="relative" ref={suggestionsRef}>
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
            placeholder="Search for places..."
            className="w-full p-2 border rounded bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {showSuggestions && (
            <ul className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border dark:border-gray-600 rounded-md shadow-lg max-h-60 overflow-y-auto">
              {suggestions.map((item, idx) => (
                <li
                  key={item.placeId || idx}
                  onClick={() => handleSuggestionClick(item)}
                  className="px-4 py-2 text-sm cursor-pointer hover:bg-blue-50 dark:hover:bg-gray-700 dark:text-gray-200 transition-colors"
                >
                  {item.label}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Number of Days */}
      <div className="flex flex-col w-full max-w-2xl mb-8">
        <label className="text-black dark:text-white text-xl sm:text-2xl font-semibold mb-2">
          For how many days are you planning?
        </label>
        <Input
          placeholder="e.g., 6"
          type="number"
          onChange={(e) => handleInputChange("noOfDays", e.target.value)}
          className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600 dark:text-white"
        />
      </div>

      {/* Budget */}
      <div className="flex flex-col w-full max-w-2xl mb-8">
        <h2 className="text-black dark:text-white text-xl sm:text-2xl font-semibold mb-4">
          What is your budget?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {SelectBudgetOptions.map((item, index) => (
            <div
              key={index}
              className={`rounded-xl border-2 border-transparent hover:border-blue-500 hover:bg-white dark:hover:bg-gray-700 transition-all duration-300 p-6 cursor-pointer ${
                formData?.budget === item.title
                  ? "shadow-lg bg-blue-600 text-white"
                  : "bg-white dark:bg-gray-800 dark:text-gray-200"
              }`}
              onClick={() => handleInputChange("budget", item.title)}
            >
              <div className="flex flex-col items-center text-center">
                <div className="text-4xl mb-2">{item.icon}</div>
                <h2 className="text-lg font-bold mb-1">{item.title}</h2>
                <p className="text-sm">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Number of People */}
      <div className="flex flex-col w-full max-w-2xl mb-8">
        <h2 className="text-black dark:text-white text-xl sm:text-2xl font-semibold mb-4">
          Who do you plan on travelling with?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {SelectTravelList.map((item, index) => (
            <div
              key={index}
              className={`rounded-xl border-2 border-transparent hover:border-blue-500 hover:bg-white dark:hover:bg-gray-700 transition-all duration-300 p-6 cursor-pointer ${
                formData?.noOfPeople === item.people
                  ? "shadow-lg bg-blue-600 text-white"
                  : "bg-white dark:bg-gray-800 dark:text-gray-200"
              }`}
              onClick={() => handleInputChange("noOfPeople", item.people)}
            >
              <div className="flex items-center justify-center">
                <div className="text-4xl mr-2">{item.icon}</div>
                <h2 className="text-lg font-bold">{item.title}</h2>
              </div>
              <p className="text-center mt-2">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Generate Trip Button */}
      <div className="flex flex-col items-center w-full max-w-2xl">
        <button
          onClick={onGenerateTrip}
          disabled={loading}
          className="w-full py-4 px-6 text-lg font-bold text-white rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:scale-105 active:scale-100 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-70 disabled:hover:scale-100"
        >
          {loading ? LOADING_MESSAGES[loadingMsgIndex] : "✨ Generate My Trip"}
        </button>
      </div>

      {/* Sign In Dialog */}
      <Dialog open={openDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sign In</DialogTitle>
            <DialogDescription>
              <div className="flex flex-col items-center">
                <span className="text-3xl font-extrabold">
                  <span className="text-blue-500">Roam</span><span className="text-purple-600">Craft</span>
                </span>
                <span>Sign in with Google Authentication securely</span>
                <Button onClick={login} className="w-full mt-5">
                  Sign in with Google
                </Button>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
    </>
  );
};

export default CreateTrip;
