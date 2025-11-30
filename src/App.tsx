import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Mic, Send, Globe, Home, MapPin, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { inject } from '@vercel/analytics';
import ThemeSelector from './components/ThemeSelector';
import Avatar from './components/Avatar';
import ChatBubble from './components/ChatBubble';
import type { ThemeId, Message, ChatResponse, Coords, AvatarState, LocationResponse } from './types';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

// Initial messages for each theme
const initialMessages: Record<ThemeId, Omit<ChatResponse, 'location_name'> & { location_name: string }> = {
  Travel: {
    english_text: "Hello! I'm TenkiGuide, your weather companion for travel. Where are you planning to go?",
    japanese_text: "こんにちは！私はTenkiGuide、あなたの旅行のお天気コンパニオンです。どこへ行く予定ですか？",
    summary: "In Unknown Location, TenkiGuide introduced itself for travel theme.",
    hex_color: "#87CEEB",
    avatar_state: "happy",
    location_name: "Unknown Location"
  },
  Fashion: {
    english_text: "Hi there! I'm TenkiGuide, here to help with fashion and weather. What outfit are you thinking about?",
    japanese_text: "こんにちは！私はTenkiGuide、ファッションとお天気をサポートします。何の服装を考えていますか？",
    summary: "In Unknown Location, TenkiGuide introduced itself for fashion theme.",
    hex_color: "#FFB6C1",
    avatar_state: "neutral",
    location_name: "Unknown Location"
  },
  Agriculture: {
    english_text: "Greetings! I'm TenkiGuide, assisting with weather for agriculture. How can I help with your farming needs?",
    japanese_text: "こんにちは！私はTenkiGuide、農業のお天気をサポートします。農業のニーズでどのようにお手伝いできますか？",
    summary: "In Unknown Location, TenkiGuide introduced itself for agriculture theme.",
    hex_color: "#90EE90",
    avatar_state: "neutral",
    location_name: "Unknown Location"
  },
  Sports: {
    english_text: "Hey! I'm TenkiGuide, your sports weather expert. What sport are you interested in today?",
    japanese_text: "こんにちは！私はTenkiGuide、スポーツのお天気エキスパートです。今日はどのスポーツに興味がありますか？",
    summary: "In Unknown Location, TenkiGuide introduced itself for sports theme.",
    hex_color: "#FFD700",
    avatar_state: "happy",
    location_name: "Unknown Location"
  },
  Music: {
    english_text: "Hello! I'm TenkiGuide, bringing weather vibes to your music. What's your musical mood?",
    japanese_text: "こんにちは！私はTenkiGuide、あなたの音楽に天気のバイブをもたらします。音楽のムードはどうですか？",
    summary: "In Unknown Location, TenkiGuide introduced itself for music theme.",
    hex_color: "#9370DB",
    avatar_state: "neutral",
    location_name: "Unknown Location"
  },
  Storyteller: {
    english_text: "Welcome! I'm TenkiGuide, weaving weather into stories. What tale shall we tell?",
    japanese_text: "ようこそ！私はTenkiGuide、お天気を物語に織り交ぜます。どんな物語を語りましょうか？",
    summary: "In Unknown Location, TenkiGuide introduced itself for storyteller theme.",
    hex_color: "#FFA07A",
    avatar_state: "surprised",
    location_name: "Unknown Location"
  }
};

const App: React.FC = () => {
  // --- State Management ---
  const [selectedTheme, setSelectedTheme] = useState<ThemeId | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Dynamic UI State
  const [avatarState, setAvatarState] = useState<AvatarState>('happy');
  const [bgColor, setBgColor] = useState('#e0f2fe'); 
  const [locationName, setLocationName] = useState('Locating...');
  const [coords, setCoords] = useState<Coords>({ lat: null, lon: null });
  const [locationSet, setLocationSet] = useState(false);
  const [chatSummary, setChatSummary] = useState("No context yet.");
  const [language, setLanguage] = useState<'en' | 'ja'>('en');

  // Refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 1. Get Location on Mount
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          setCoords({ lat, lon });
          try {
            const response = await axios.get<LocationResponse>(`${BACKEND_URL}/location?lat=${lat}&lon=${lon}`);
            setLocationName(response.data.location_name);
            setLocationSet(true);
          } catch (error) {
            console.error("Error fetching location:", error);
            setLocationName("Location Unavailable");
          }
        },
        (error) => {
          console.warn("Geolocation Error:", error);
          setLocationName("Location Unavailable");
        }
      );
    } else {
      setLocationName("Geolocation not supported");
    }
  }, []);

  // Inject Vercel Analytics
  useEffect(() => {
    inject();
  }, []);

  // 3. Add initial message when theme is selected
  useEffect(() => {
    if (selectedTheme && messages.length === 0) {
      const initial = initialMessages[selectedTheme];
      setBgColor(initial.hex_color);
      setAvatarState(initial.avatar_state);
      const summary = locationSet ? initial.summary.replace("Unknown Location", locationName) : `TenkiGuide introduced itself for ${selectedTheme} theme.`;
      setChatSummary(summary);
      setLocationName(locationName);
      setMessages([{
        text: "",
        english_text: initial.english_text,
        japanese_text: initial.japanese_text,
        isUser: false
      }]);
    }
  }, [selectedTheme, messages.length, locationName, locationSet]);

  // 3. Handle Text Send
  const handleSendMessage = async (textOverride: string | null = null) => {
    const textToSend = textOverride || inputText;
    if (!textToSend.trim()) return;

    // Optimistic UI Update
    const userMsg: Message = { text: textToSend, isUser: true };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      // Send Text to Backend
      const response = await axios.post<ChatResponse>(`${BACKEND_URL}/chat`, {
        user_message: textToSend,
        latitude: coords.lat,
        longitude: coords.lon,
        chat_summary: chatSummary,
        theme: selectedTheme
      });

      const data = response.data;
      
      // Update App State
      setBgColor(data.hex_color);
      setAvatarState(data.avatar_state);
      setChatSummary(data.summary);
      if (!locationSet) {
        setLocationName(data.location_name);
        setLocationSet(true);
      }

      // Add AI Message (We do NOT fetch audio here anymore)
      setMessages(prev => [...prev, {
        text: "", // Not used for AI
        english_text: data.english_text,
        japanese_text: data.japanese_text,
        isUser: false
      }]);

    } catch (error) {
      console.error('Chat Error:', error);
      setMessages(prev => [...prev, {
        text: 'Sorry, I lost connection to the server.',
        isUser: false
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // 4. Audio Recording Logic
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const formData = new FormData();
        formData.append('file', audioBlob, "voice.webm");

        try {
          setIsLoading(true);
          const res = await axios.post(`${BACKEND_URL}/transcribe`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
          if (res.data.transcript) {
             handleSendMessage(res.data.transcript);
          }
        } catch (error) {
          console.error("Transcription Error:", error);
          setIsLoading(false);
        }
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Microphone access error:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // --- RENDER ---
  if (!selectedTheme) {
    return <ThemeSelector onThemeSelect={setSelectedTheme} />;
  }

  return (
    <div 
      className="min-h-screen transition-colors duration-1000 ease-in-out font-sans overflow-hidden"
      style={{ background: `linear-gradient(135deg, ${bgColor} 0%, ${bgColor}dd 100%)` }}
    >
      {/* Floating Avatar */}
      <Avatar avatarState={avatarState} className="fixed bottom-15 right-8 z-50 w-32 h-32" />

      {/* Main Flex Container */}
      <div className="w-full h-screen flex flex-col overflow-x-hidden">
        
        {/* Header */}
        <div className="bg-white/60 backdrop-blur-md px-6 py-4 border-b border-white/40 shadow-sm z-10 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                setSelectedTheme(null);
                setMessages([]);
                setChatSummary('');
              }}
              className="p-2 hover:bg-white/50 rounded-full transition-colors"
            >
              <Home size={22} className="text-gray-700" />
            </motion.button>
            <div>
              <h2 className="text-lg font-bold text-gray-800">TenkiGuide - {selectedTheme}</h2>
              <div className="flex items-center text-xs text-gray-600 font-medium">
                <MapPin size={12} className="mr-1" />
                {locationName}
              </div>
            </div>
          </div>
          
          <button
            onClick={() => setLanguage(prev => prev === 'en' ? 'ja' : 'en')}
            className="px-3 py-1.5 bg-white/50 hover:bg-white/80 rounded-full flex items-center gap-2 text-sm font-semibold text-gray-700 transition-all shadow-sm border border-white/40"
          >
            <Globe size={16} />
            {language === 'en' ? 'EN' : 'JP'}
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-scroll overflow-x-hidden p-4 md:p-6 space-y-4 relative">
          {messages.length === 0 && (
            <div className="text-center text-gray-500/60 mt-20 flex flex-col items-center">
              <span className="text-6xl mb-4 grayscale opacity-50 block">👋</span>
              <p className="text-lg font-medium">Hello!</p>
              <p className="text-sm mt-2">Start chatting with TenkiGuide about {selectedTheme.toLowerCase()}</p>
            </div>
          )}
          
          {messages.map((msg, idx) => (
            <ChatBubble
              key={idx}
              message={msg}
              isUser={msg.isUser}
              currentLang={language}
              backendUrl={BACKEND_URL}
            />
          ))}

          {isLoading && (
            <div className="flex justify-start pl-2">
              <div className="bg-white/80 rounded-2xl px-4 py-3 shadow-sm flex items-center gap-2">
                 <Loader2 className="animate-spin w-4 h-4 text-gray-500" />
                 <span className="text-xs text-gray-500 font-medium">Thinking...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="bg-white/60 backdrop-blur-md p-4 border-t border-white/40 z-20">
          <div className="max-w-4xl mx-auto flex items-center gap-2 md:gap-3">
            
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={isRecording ? stopRecording : startRecording}
              className={`shrink-0 p-3 rounded-full transition-all shadow-md ${
                isRecording
                  ? 'bg-red-500 text-white animate-pulse'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              <Mic size={20} />
            </motion.button>
            
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder={isRecording ? "Listening..." : "Type a message..."}
              disabled={isRecording}
              className="flex-1 min-w-0 px-4 md:px-5 py-3 rounded-full border border-gray-200/50 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white/80 text-gray-800 placeholder-gray-400 shadow-inner"
            />
            
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => handleSendMessage()}
              disabled={!inputText.trim() || isLoading}
              className="shrink-0 p-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={20} />
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;