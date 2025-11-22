import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

const MODEL_ID = "gemini-2.5-flash";

export const generatePostContent = async (topic: string): Promise<string> => {
  if (!ai) {
    console.warn("Gemini API Key missing");
    return "API Key missing. Please configure the environment.";
  }

  try {
    const prompt = `Write a short, engaging social media post about "${topic}". 
    Include 1-2 emojis. Keep it under 280 characters. 
    Do not include hashtags unless absolutely necessary.`;

    const response = await ai.models.generateContent({
      model: MODEL_ID,
      contents: prompt,
    });

    return response.text || "";
  } catch (error) {
    console.error("Error generating content:", error);
    return "";
  }
};

export const improvePostGrammar = async (text: string): Promise<string> => {
  if (!ai) return text;

  try {
    const prompt = `Fix the grammar and make this social media post sound more professional yet friendly: "${text}". Return only the fixed text.`;
    
    const response = await ai.models.generateContent({
      model: MODEL_ID,
      contents: prompt,
    });

    return response.text?.trim() || text;
  } catch (error) {
    console.error("Error improving content:", error);
    return text;
  }
};