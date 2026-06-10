import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-100 to-gray-100 px-4">
          <div className="bg-white rounded-2xl shadow-lg p-10 max-w-md w-full text-center">
            <div className="text-6xl mb-4">✈️</div>
            <h1 className="text-2xl font-bold text-blue-900 mb-2">
              Oops! Your trip hit some turbulence
            </h1>
            <p className="text-gray-600 mb-6">
              Something went wrong while loading this page. Don't worry — let's
              get you back on track.
            </p>
            {this.state.error && (
              <p className="text-sm text-gray-400 bg-gray-50 rounded-lg p-3 mb-6 break-words">
                {this.state.error.message}
              </p>
            )}
            <a
              href="/"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-6 rounded-lg transition-colors"
            >
              Go Back Home
            </a>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
