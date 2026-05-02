import { callGemini } from "./ai.service.js";
import { createNatureReflectionPrompt } from "../prompts/nature.prompt.js";

const ensureArrays = (result) => {
  return {
    ...result,
    actions: Array.isArray(result.actions) ? result.actions : [],
    music: {
      ...result.music,
      tracks: Array.isArray(result.music?.tracks) ? result.music.tracks : [],
    },
  };
};

const clampIntensity = (result) => {
  if (!result.emotion) return result;
  return {
    ...result,
    emotion: {
      ...result.emotion,
      intensity: Math.min(1, Math.max(0, result.emotion.intensity ?? 0.5)),
    },
  };
};

export const analyzeNatureWithLLM = async (fileParts = []) => {
  if (!fileParts.length) throw new Error("No image provided");

  const prompt = createNatureReflectionPrompt("Analyze the attached nature image directly.");

  const result = await callGemini(prompt, fileParts);

  const processed = ensureArrays(clampIntensity(result));

  return processed;
};