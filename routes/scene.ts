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

sceneRouter.get("/:sceneId/voice", async (req, res) => {
  try {
    const { sceneId } = req.params;
    
    if (!sceneId) {
      return res.status(400).json({ error: "Scene ID is required" });
    }

    const scene = await prisma.scene.findUnique({
      where: { id: parseInt(sceneId) },
      include: {
        scriptLines: {
          orderBy: { order: 'asc' }
        }
      }
    });

    if (!scene) {
      return res.status(404).json({ error: "Scene not found" });
    }

    console.log(`Generating voice for scene: ${scene.title} in ${scene.language}`);

    const voiceResults = await Promise.all(
      scene.scriptLines.map(async (line) => {
        try {
          const voiceData = await generateVoiceWithMurf(line.text, scene.language, line.speaker);
          
          // Update the script line with the audio URL in the database
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
          console.error(`Failed to generate voice for line ${line.id}:`, voiceError);
          return {
            scriptLineId: line.id,
            order: line.order,
            speaker: line.speaker,
            text: line.text,
            answer: line.answer,
            voiceUrl: null,
            error: "Voice generation failed"
          };
        }
      })
    );

    res.json({
      sceneId: scene.id,
      title: scene.title,
      description: scene.description,
      language: scene.language,
      scriptLines: voiceResults
    });

  } catch (error) {
    console.error("Error generating voice for scene:", error);
    res.status(500).json({ 
      error: "Failed to generate voice for scene",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

// GET endpoint to retrieve scene with stored audio URLs (no voice generation)
sceneRouter.get("/:sceneId", async (req, res) => {
  try {
    const { sceneId } = req.params;
    
    if (!sceneId) {
      return res.status(400).json({ error: "Scene ID is required" });
    }

    // Fetch scene with script lines from database
    const scene = await prisma.scene.findUnique({
      where: { id: parseInt(sceneId) },
      include: {
        scriptLines: {
          orderBy: { order: 'asc' }
        }
      }
    });

    if (!scene) {
      return res.status(404).json({ error: "Scene not found" });
    }

    // Format response to match the expected structure
    const formattedResponse = {
      sceneId: scene.id,
      title: scene.title,
      description: scene.description,
      language: scene.language,
      scriptLines: scene.scriptLines.map(line => ({
        scriptLineId: line.id,
        order: line.order,
        speaker: line.speaker,
        text: line.text,
        answer: line.answer,
        voiceUrl: line.audioUrl,
        voiceId: "en-US-natalie" // Default voice ID
      }))
    };

    res.json(formattedResponse);

  } catch (error) {
    console.error("Error retrieving scene:", error);
    res.status(500).json({ 
      error: "Failed to retrieve scene",
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
    console.error('Murf AI API error:', error);
    throw error;
  }
}

export { sceneRouter };
