// src/types.ts

// 1. The Theme Options
export type ThemeId = 'Travel' | 'Fashion' | 'Agriculture' | 'Sports' | 'Music' | 'Storyteller';

export interface ThemeOption {
  id: ThemeId;
  icon: string;
  gradient: string;
}

// 2. The Message Structure (Frontend UI)
export interface Message {
  id?: number;
  isUser: boolean;
  text?: string;         // For user messages
  english_text?: string; // For AI messages
  japanese_text?: string; // For AI messages     
     // Optional audio URL
}

// 3. The Backend API Response
export type AvatarState = 'happy' | 'sad' | 'neutral' | 'wearing_sunglasses' | 'wearing_scarf' | 'holding_umbrella' | 'shocked' | 'shivering' | 'raining' | 'surprised';

export interface ChatResponse {
  english_text: string;
  japanese_text: string;
  summary: string;
  hex_color: string;
  avatar_state: AvatarState;
  location_name: string;
}

// 4. Coordinates
export interface Coords {
  lat: number | null;
  lon: number | null;
}

// 5. Location Response
export interface LocationResponse {
  location_name: string;
}