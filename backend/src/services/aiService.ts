import "dotenv/config";
import { GoogleGenAI } from "@google/genai";
import { crmPrompt } from "../prompts/crmPrompt";


const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export const extractCRMData = async (records: any[]) => {
  const prompt = `
${crmPrompt}

Input Records:

${JSON.stringify(records)}
`;

  const MAX_RETRIES = 3;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-flash-latest",
        contents: prompt,
      });

      let text = response.text ?? "";

      // Remove markdown if Gemini wraps the JSON
      text = text
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      return JSON.parse(text);

    } catch (error: any) {
      console.log(`Attempt ${attempt} failed.`);

      if (attempt === MAX_RETRIES) {
        console.error("Gemini Error:", error);
        throw error;
      }

      // Wait 2 seconds before retrying
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }

  return [];
};