// Central config for API keys. Prefer env when present; fallback to embedded values.

export const GEOAPIFY_KEY = (import.meta as any).env?.VITE_GEOAPIFY_KEY || '';

// AI Conversational Engine (the "brain" of the monk)
export const AI_API_KEY = (import.meta as any).env?.VITE_AI_API_KEY || '';

// Gemini API for monk AI
export const GEMINI_API_KEY = (import.meta as any).env?.VITE_GEMINI_API_KEY || '';

// Navigation / Directions (the "legs" of the monk)
export const NAV_API_KEY = (import.meta as any).env?.VITE_NAV_API_KEY || '';

// Unsplash API for festival images
export const UNSPLASH_ACCESS_KEY = (import.meta as any).env?.VITE_UNSPLASH_ACCESS_KEY || '';

// OpenCage geocoding for map search
export const OPENCAGE_API_KEY = (import.meta as any).env?.VITE_OPENCAGE_API_KEY || '';

// Blockchain APIs
export const ALCHEMY_API_KEY = (import.meta as any).env?.VITE_ALCHEMY_API_KEY || '';
export const ETHERSCAN_API_KEY = (import.meta as any).env?.VITE_ETHERSCAN_API_KEY || '';

// Blockchain network configuration
export const BLOCKCHAIN_CONFIG = {
  ALCHEMY_URL: `https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
  ETHERSCAN_URL: 'https://api.etherscan.io/api',
  NETWORK: 'mainnet', // or 'polygon', 'sepolia' for testnet
  CHAIN_ID: 1, // Ethereum mainnet
} as const;


