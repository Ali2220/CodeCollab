const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const getGeminiModel = async (prompt) => {
  return await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });
};
module.exports = { getGeminiModel };
