# RoamCraft ✈️ — AI Trip Planner

![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.3-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-10.12-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)
![Gemini AI](https://img.shields.io/badge/Gemini_AI-Powered-8E75B2?style=for-the-badge&logo=google&logoColor=white)

**RoamCraft** is an AI-powered travel planner that generates personalized itineraries, hotel recommendations, and day-by-day plans in seconds — all powered by Google Gemini AI.

---

## Features

- 🤖 **AI-Generated Itineraries** — Get a complete day-by-day travel plan tailored to your preferences
- 🏨 **Hotel Recommendations** — Curated hotel picks that match your budget and destination
- 📍 **Google Places Integration** — Autocomplete destinations with the Google Places API
- 🔐 **Google OAuth** — Secure sign-in with Google authentication
- 🔥 **Firebase Backend** — Trips stored and synced with Firestore in real time
- 🌙 **Dark Mode** — Full dark/light theme toggle
- 📱 **Responsive Design** — Looks great on mobile, tablet, and desktop
- 📄 **PDF Export** — Download your trip itinerary as a PDF
- 💀 **Skeleton Loading** — Smooth loading states for a polished UX

---

## Tech Stack

| Layer        | Technology                          |
| ------------ | ----------------------------------- |
| Framework    | React 18 + Vite                     |
| Styling      | Tailwind CSS + shadcn/ui            |
| AI Engine    | Google Gemini AI                    |
| Auth         | Google OAuth 2.0                    |
| Database     | Firebase Firestore                  |
| Maps/Places  | Google Places API (New)             |
| Animations   | GSAP                                |
| Routing      | React Router v6                     |

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Google Cloud project with Places API and Gemini API enabled
- Firebase project

### Installation

```bash
git clone https://github.com/your-username/roamcraft.git
cd roamcraft
npm install
```

### Environment Variables

Create a `.env.local` file in the project root:

```env
VITE_GOOGLE_PLACE_API_KEY=your_google_places_api_key
VITE_GOOGLE_GEMINI_AI_API_KEY=your_gemini_ai_api_key
VITE_GOOGLE_AUTH_CLIENT_ID=your_google_oauth_client_id
VITE_GOOGLE_FIREBASE_API_KEY=your_firebase_api_key
VITE_GOOGLE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_GOOGLE_FIREBASE_PROJECT_ID=your_project_id
VITE_GOOGLE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_GOOGLE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_GOOGLE_FIREBASE_APP_ID=your_app_id
VITE_GOOGLE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### Run the App

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## How It Works

1. **Choose a Destination** — Search for any city or country with Google Places autocomplete
2. **Set Your Preferences** — Pick your trip duration, budget, and travel companions
3. **Generate with AI** — RoamCraft sends your preferences to Google Gemini AI, which crafts a full itinerary
4. **View Your Trip** — Browse your personalized day-by-day plan with hotel recommendations and points of interest
5. **Save & Revisit** — All trips are saved to Firebase so you can access them anytime

---

## License

This project is licensed under the [MIT License](LICENSE).
