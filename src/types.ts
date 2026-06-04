export interface Coin {
  id: string;
  name: string;
  country: string;
  year: string;
  denomination: string;
  material: string;
  size: string;
  diameter: string;
  weight: string;
  history: string;
  background: string;
  details: string;
  symbol: string; // The emoji, letter, or visual icon on the coin face
  metalColor: string; // "gold", "silver", "bronze", "bimetallic"
  coords: {
    lat: number;
    lng: number;
  };
  funFact: string;
  image: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "model";
  text: string;
  timestamp: Date;
}
