# MindArc Learning Tracker 🧠

MindArc is a sophisticated "second brain" designed for lifelong learners. It allows you to track your daily educational progress, organize key takeaways, manage a library of resources, and get AI-powered coaching insights.

## ✨ Key Features

- **Daily Learning Logs**: Quick-entry form to capture topics, categories, and key takeaways.
- **AI Progress Reports**: Integrated with Google Gemini to analyze your recent activity and suggest next steps in your learning path.
- **Chronological Timeline**: A beautiful, filterable history of everything you've learned.
- **Resource Library**: Automatically aggregates all saved links from your logs into a searchable directory.
- **Progress Dashboard**: Visualizes your learning consistency and category distribution using interactive charts.
- **Cloud Sync**: Secure authentication and real-time data persistence powered by Firebase.
- **Exportable Data**: Download your entire learning history as a JSON file at any time.

## 🛠 Tech Stack

- **Frontend**: React 19 (Hooks, Context, Functional Components)
- **Styling**: Tailwind CSS
- **Database/Auth**: Firebase Firestore & Firebase Auth
- **AI Engine**: Google Gemini API (@google/genai)
- **Charts**: Recharts
- **Logging**: Custom internal System Logger for debugging

## 🚀 Getting Started

### 1. Prerequisites
- An active Google Cloud project with the **Gemini API** enabled.
- A **Firebase** project with Email/Password authentication and Firestore enabled.

### 2. Environment Variables
Ensure the following are configured in your environment:
- `process.env.API_KEY`: Your Google Gemini API Key.

### 3. Firebase Setup
The app is pre-configured to a demo Firebase instance. If you use your own, update `services/firebase.ts` with your credentials.

**Important: Firestore Indexing**
MindArc uses complex queries to sort logs by time. Firestore requires a "Composite Index" for this.
- If the app hangs on "Syncing with Cloud", check the browser console or download the **System Logs** from the login screen.
- Look for an error message containing a link to `console.firebase.google.com`.
- Clicking that link will automatically set up the required index for your database.

## 📂 Project Structure

- `App.tsx`: Main application logic and state management.
- `services/`:
  - `backend.ts`: Firebase Firestore and Auth integration.
  - `geminiService.ts`: AI analysis logic.
  - `mockBackend.ts`: Fallback local storage for offline use.
  - `systemLogger.ts`: Captures app events for troubleshooting.
- `components/`: Modular UI components for Forms, Timelines, and Charts.
- `types.ts`: TypeScript interface definitions.

## 🛡️ Data Privacy
Your learning data is stored securely in your private Firebase instance. No data is shared except for the snippets sent to the Gemini API for analysis (if enabled).

---
*Built with ❤️ for learners everywhere.*