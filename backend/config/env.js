import "dotenv/config";

export const env = {
  PORT:                   process.env.PORT || 5000,
  CLIENT_URL:             process.env.CLIENT_URL || "http://localhost:5173",
  GEMINI_API_KEY:         process.env.GEMINI_API_KEY
};