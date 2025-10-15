// src/core/aiProcessor.js
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import fetch from "node-fetch";
import { logger } from "../utils/logger";

dotenv.config({ path: path.join(process.cwd(), ".env") });

const API_KEY = process.env.GEMINI_API_KEY;
const MODEL = process.env.MODEL || "gemini-1.5-flash";

if (!API_KEY) {
  console.error("❌ GEMINI_API_KEY not found in .env file");
  process.exit(1);
}

/**
 * Send prompt to Google Gemini API and return result
 * @param {string} commandType
 * @param {string} userInput
 */
export async function runAICommand(commandType, userInput) {
  try {
    const prompt = buildPrompt(commandType, userInput);

    const response = await fetch(
  `https://generativelanguage.googleapis.com/v1/models/${MODEL}:generateContent?key=${API_KEY}`,
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          role: "user",
          parts: [{ text: String(prompt) }],
        },
      ],
    }),
  }
);


    const data = await response.json();

    if (data.error) throw new Error(data.error.message);

    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "⚠️ No response received.";
    return text;
  } catch (error) {
    return `❌ Error: ${error.message}`;
  }
}


/**
 * Builds a custom prompt for the AI based on command type
 */
function buildPrompt(type, input) {
  switch (type) {
    case "edit":
      return `Edit this code smartly:\n${input}`;
    case "explain":
      return `Explain this code in detail:\n${input}`;
    default:
      return input;
  }
}




























// import OpenAI from 'openai';
// import { logger } from '../utils/logger.js';

// export async function processAIRequest(prompt, settings) {
//   try {
//     const openai = new OpenAI({
//       apiKey: settings.openaiApiKey,
//     });

//     const response = await openai.chat.completions.create({
//       model: settings.model,
//       messages: [{ role: 'user', content: prompt }],
//       max_tokens: settings.maxTokens,
//     });

//     const result = response.choices[0].message.content;
//     logger.info('AI request processed successfully');
//     return result;
//   } catch (error) {
//     logger.error(`Error in AI request: ${error.message}`);
//     throw error;
//   }
// }
