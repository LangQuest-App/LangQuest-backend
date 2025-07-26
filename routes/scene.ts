import express from "express";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { PrismaClient } from "@prisma/client";

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

if (!apiKey) {
  throw new Error("GOOGLE_API_KEY environment variable is not set.");
}
const genAI = new GoogleGenerativeAI(apiKey);

sceneRouter.post("/", async (req, res) => {
  try {
    const { language } = req.body;

    if (!language) {
      return res.status(400).json({ error: "Language parameter is required" });
    }

    const scenePrompt = scene(language);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const geminiResponse = await model.generateContent(scenePrompt);
    
    const responseText = JSON.parse(geminiResponse.response.text());

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
        scriptLines: {
          orderBy: { order: 'asc' }
        }
      },
    });

    const scriptLinesWithVoice = await Promise.all(
      createdScene.scriptLines.map(async (line: {id: number, text: string, speaker: string, order: number, answer: string | null}) => {
        try {
          
          const voiceData = await generateVoiceWithMurf(line.text, language, line.speaker);
          
          await prisma.scriptLine.update({
            where: { id: line.id },
            data: { audioUrl: voiceData.audioUrl }
          });

          return {
            scriptLineId: line.id,
            order: line.order,
            speaker: line.speaker,
            text: line.text,
            answer: line.answer,
            voiceUrl: voiceData.audioUrl,
            voiceId: voiceData.voiceId
          };
        } catch (voiceError) {
          
          return {
            scriptLineId: line.id,
            order: line.order,
            speaker: line.speaker,
            text: line.text,
            answer: line.answer,
            voiceUrl: null,
            voiceId: null,
            error: "Voice generation failed"
          };
        }
      })
    );
    const finalResponse = {
      sceneId: createdScene.id,
      title: createdScene.title,
      description: createdScene.description,
      language: createdScene.language,
      scriptLines: scriptLinesWithVoice
    };

    res.json(finalResponse);

  } catch (error) {
    console.error("Error details:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      type: error?.constructor?.name
    });
    
    res.status(500).json({ 
      error: "Failed to generate complete scene with voice",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

sceneRouter.get("/", async (req, res) => {
  try {

    const latestScene = await prisma.scene.findFirst({
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        scriptLines: {
          orderBy: { order: 'asc' }
        }
      }
    });

    if (!latestScene) {
      console.log("❌ No scenes found in database");
      return res.status(404).json({ error: "No scenes found in database" });
    }

    console.log("✅ Latest scene found:", {
      sceneId: latestScene.id,
      title: latestScene.title,
      language: latestScene.language,
      scriptLinesCount: latestScene.scriptLines.length,
      createdAt: latestScene.createdAt
    });

    const formattedResponse = {
      sceneId: latestScene.id,
      title: latestScene.title,
      description: latestScene.description,
      language: latestScene.language,
      createdAt: latestScene.createdAt,
      scriptLines: latestScene.scriptLines.map((line: {id: number, order: number, speaker: string, text: string, answer: string | null, audioUrl: string | null}) => ({
        scriptLineId: line.id,
        order: line.order,
        speaker: line.speaker,
        text: line.text,
        answer: line.answer,
        voiceUrl: line.audioUrl,
        voiceId: line.audioUrl ? "en-US-natalie" : null
      }))
    };
    res.json(formattedResponse);

  } catch (error) {
    console.error("Error details:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      type: error?.constructor?.name
    });
    
    res.status(500).json({ 
      error: "Failed to fetch latest scene",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

async function generateVoiceWithMurf(text: string, language: string, speaker: string) {
  const murfApiKey = process.env.MURF_API_KEY;
  
  if (!murfApiKey) {
    throw new Error("MURF_API_KEY environment variable is not set");
  }

  const voiceId = "en-US-natalie";

  try {
    const response = await fetch('https://api.murf.ai/v1/speech/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': murfApiKey,
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        voiceId: voiceId,
        text: text,
        speed: 1.0,
        pitch: 1.0,
        sampleRate: 24000,
        audioFormat: 'mp3',
        pronunciationDictionary: {},
        encodeAsBase64: false
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Murf API error: ${response.status} - ${response.statusText}. Details: ${errorText}`);
    }

    const data = await response.json();
    
    return {
      audioUrl: data.audioFile || data.audioUrl || data.audio_url,
      voiceId: voiceId,
      duration: data.duration || null
    };

  } catch (error) {
    console.error('Error details:', {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined
    });
    throw error;
  }
}

export { sceneRouter };
