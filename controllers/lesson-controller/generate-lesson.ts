import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import { IUserPreference } from "../../types/user";
import { Lesson } from "../../generated/prisma";
import { lessonPrompt } from "../../prompt/lesson";
import getVoiceID from "../../utils/getVoiceId";

dotenv.config();

const GOOGLE_KEY = process.env.GOOGLE_API_KEY;
const MURF_API_KEY = process.env.MURF_API_KEY;

async function generateTTS(phrase:string,voiceID:string) {
  try {
    console.log(voiceID)
    const response = await fetch("https://api.murf.ai/v1/speech/generate", {
      method: "POST",
      headers: new Headers({
        "api-key": MURF_API_KEY || "",
        "Content-Type": "application/json",
      }),
      body: JSON.stringify({
        text: phrase,
        voiceId: voiceID,
      }),
    });

    const body = await response.json();
    console.log("TTS Response:", body);
    return body.audioFile || "TTS_URL_NOT_AVAILABLE";
  } catch (err) {
    console.error(`TTS generation failed for: ${phrase}`, err);
    return "TTS_ERROR";
  }
}

// Utility: Inject TTS into each question
async function injectTTS(lessons:Lesson[],voiceID:string) {
  type Question = {
    question: string;
    phonetic: string;
    tts_url: string;
    answer_type: "multiple_choice" | "text_input";
    correct_answer: string;
    options?: string[];
  };
  for (const lesson of lessons) {
    const questions = lesson.questions as Question[];
    for (const question of questions) {
      const tts = await generateTTS(question.phonetic,voiceID);
      question.tts_url = tts;
    }
  }
  return lessons;
}

// Main function
export async function generateCourseWithTTS(data:IUserPreference) {
  try {
    if (!GOOGLE_KEY) {
        console.log("NO key")
      return {
        status: "401",
        data: "Please get an API key before accessing gemini model",
      };
    }
    const genAI = new GoogleGenerativeAI(GOOGLE_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const systemPrompt = lessonPrompt(data);

    const result = await model.generateContent(systemPrompt);
    let raw = result.response.text();
    raw = raw.replace(/```json|```|\n/g, "").trim();

    const parsed = JSON.parse(raw);
    console.log(parsed); 
    console.log(typeof parsed);
    let voiceID = getVoiceID(data.native_lang)
    console.log("voice id",voiceID)
    const updatedLessons = await injectTTS(parsed.lessons,voiceID);

    return { lessons: updatedLessons };
  } catch (error) {
    console.error("Error generating course:", error);
    return null;
  }
}
