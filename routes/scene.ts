import express from "express";
import dotenv from "dotenv";
import { scene } from "../prompt/scene";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const sceneRouter = express.Router();
const apiKey = process.env.GOOGLE_API_KEY;

if (!apiKey) {
  throw new Error("GOOGLE_API_KEY environment variable is not set.");
}
const genAI = new GoogleGenerativeAI(apiKey);

sceneRouter.post("/", async (req, res) => {
  try {
    const { language } = req.body;

    const scenePrompt = scene(language);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const responseText = JSON.parse(
      (await model.generateContent(scenePrompt)).response.text()
    );

    res.json(responseText);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

export { sceneRouter };
