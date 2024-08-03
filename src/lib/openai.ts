import OpenAI from "openai";

const apiKey = process.env.OPENROUTER_API;

if (!apiKey) {
  throw new Error("OPENROUTER_API is not set");
}

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey,
});

export default openai;
