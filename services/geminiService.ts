
import { GoogleGenAI } from "@google/genai";

export const getLearningSummary = async (logs: any[]) => {
  if (!process.env.API_KEY || logs.length === 0) return null;

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze these recent learning logs and provide a 3-sentence summary of the user's progress and one specific suggestion for what they could learn next. Keep it encouraging.
      Logs: ${JSON.stringify(logs.slice(0, 5))}`,
      config: {
        systemInstruction: "You are a professional learning coach. Provide concise, actionable insights.",
      }
    });
    return response.text || null;
  } catch (error) {
    console.error("Gemini error:", error);
    return null;
  }
};
