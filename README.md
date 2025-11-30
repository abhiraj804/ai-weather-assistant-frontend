# TenkiGuide - AI Weather Assistant (Frontend)

![React](https://img.shields.io/badge/React-19-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-7.0-purple?logo=vite)
![TailwindCSS](https://img.shields.io/badge/Tailwind-v4-cyan?logo=tailwindcss)

**TenkiGuide** is a next-generation conversational weather assistant that combines real-time meteorological data with generative AI personas. Built with modern web technologies, it offers a seamless, bilingual voice interface that adapts its personality and visual style based on user-selected themes.

---

## ✨ Key Features

*   **🎭 Dynamic Persona Engine:** Choose from themes like *Agriculture, Fashion, Travel, Sports, Music, or Storyteller*. The AI adapts its advice and tone accordingly.
*   **🐣 Reactive Avatar System:** A custom, code-driven SVG character that reacts visually to the weather (e.g., shivering in cold, wearing sunglasses in sun) and AI emotions.
*   **🗣️ Full Voice Integration:**
    *   **Input:** Record your queries in English or Japanese directly through the browser (WebRTC).
    *   **Output:** Natural-sounding Neural Text-to-Speech (TTS) playback via the backend.
*   **🌏 Bilingual Support:** Instant toggle between English and Japanese UI and conversation modes.
*   **⚡ Optimistic UI:** Built for speed with optimistic state updates and smooth Framer Motion animations.

## 🛠️ Tech Stack

*   **Core:** React 19, TypeScript
*   **Build Tool:** Vite 7.x
*   **Styling:** TailwindCSS v4
*   **Animation:** Framer Motion
*   **State/Network:** Axios, React Hooks
*   **Audio:** WebRTC MediaRecorder API

## 🚀 Getting Started

Follow these instructions to get the project up and running on your local machine.

### Prerequisites

*   Node.js (v18 or higher)
*   npm or yarn
*   A running instance of the **TenkiGuide Backend** (see [backend repository](https://github.com/abhiraj804/ai-weather-assistant-backend))

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/abhiraj804/ai-weather-assistant-frontend.git
    cd ai-weather-assistant-frontend
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Environment Configuration**
    Create a `.env` file in the root directory. You can copy the example below:
    
    ```env
    # URL of your running backend (FastAPI)
    # For local development:
    VITE_BACKEND_URL=http://localhost:8000
    
    # For production:
    # VITE_BACKEND_URL=https://your-backend-service.onrender.com
    ```

4.  **Run the Development Server**
    ```bash
    npm run dev
    ```
    Open `http://localhost:5173` in your browser.

## 📦 Build for Production

To create an optimized production build (minified JS/CSS):

```bash
npm run build
```

The output will be generated in the `dist/` directory, ready to be deployed to static hosting providers like Vercel, Netlify, or AWS S3.

## 📱 Browser Permissions

To use the voice features:

1.  **Microphone Access:** The browser will request permission to use your microphone. You must **Allow** this for the voice input to work.
2.  **HTTPS:** In a production environment (not localhost), the application *must* be served over HTTPS for the browser to allow audio recording via the MediaStream API.

## 📂 Project Structure

```text
src/
├── components/        
│   ├── Avatar.tsx        # Reactive SVG character logic
│   ├── ChatBubble.tsx    # Message display & Audio controls
│   └── ThemeSelector.tsx # Initial theme selection grid
├── App.tsx               # Main conversational loop & state
├── index.css             # Global styles
└── types.ts              # TypeScript interfaces
```

## 🤝 Contributing

1.  Fork the repository.
2.  Create a feature branch (`git checkout -b feature/amazing-feature`).
3.  Commit your changes (`git commit -m 'Add amazing feature'`).
4.  Push to the branch (`git push origin feature/amazing-feature`).
5.  Open a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
```