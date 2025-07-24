// imported modules
import express from "express";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { PrismaClient } from "../generated/prisma";

//Local modules
import { scene } from "../prompt/scene";

dotenv.config();

const sceneRouter = express.Router();
const apiKey = process.env.GOOGLE_API_KEY;
const prisma = new PrismaClient();

interface ScriptLineInput {
  order: number;
  speaker: string;
  text: string;
  answer: string;
}

interface SceneResponse {
  title: string;
  description: string;
  language: string;
  scriptLines: ScriptLineInput[];
}

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

    // Putting values into the database
    const createdScene = await prisma.scene.create({
      data: {
        title: responseText.title,
        description: responseText.description,
        language: responseText.language,
        scriptLines: {
          create: responseText.scriptLines.map((line: ScriptLineInput) => ({
            order: line.order,
            speaker: line.speaker,
            text: line.text,
            answer: line.answer,
          })),
        },
      },
      include: {
        scriptLines: true,
      },
    });

    res.json(responseText);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

export { sceneRouter };
