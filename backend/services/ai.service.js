import { GoogleGenAI } from "@google/genai";
import { env } from "../config/env.js";

const ai = new GoogleGenAI({
  apiKey: env.GEMINI_API_KEY,
});

export const callGemini = async (prompt, fileParts = []) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: [prompt, ...fileParts],
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.2,
        maxOutputTokens: 8192
      },
    });
    
    const rawText = response.text;

    const cleanText = rawText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    if (!cleanText.startsWith("{")) {
      console.error("AI returned non-JSON:", cleanText);
      throw new Error("Invalid JSON from AI");
    }

    return JSON.parse(cleanText);
  } catch (error) {
    throw new Error(error.message || "Gemini execution failed");
  }
};
