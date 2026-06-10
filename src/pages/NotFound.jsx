import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-100 to-gray-100 px-4">
      <div className="bg-white rounded-2xl shadow-lg p-10 max-w-md w-full text-center">
        <div className="text-7xl mb-4">✈️</div>
        <h1 className="text-3xl font-bold text-blue-900 mb-3">
          Looks like you took a wrong turn
        </h1>
        <p className="text-gray-600 mb-8">
          This page doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-6 rounded-lg transition-colors"
        >
          Take Me Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
