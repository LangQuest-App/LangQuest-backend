import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import { IUserPreference } from "../../types/user";
import { Lesson } from "../../generated/prisma";
import { lessonPrompt } from "../../prompt/lesson";
import getVoiceID from "../../utils/getVoiceId";
import { PrismaClient } from "../../generated/prisma";

dotenv.config();

const GOOGLE_KEY = process.env.GOOGLE_API_KEY;
const MURF_API_KEY = process.env.MURF_API_KEY;
const prisma = new PrismaClient();
// Generate TTS audio using Murf API
async function generateTTS(phrase: string, voiceID: string) {
  try {
    const response = await fetch("https://api.murf.ai/v1/speech/generate", {
      method: "POST",
      headers: {
        "api-key": MURF_API_KEY || "",
        "Content-Type": "application/json",
      },
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

// Inject TTS URLs into lesson questions (Optimized version using Promise.all)
/**
 * Optimization Note:
 * This function uses parallel TTS generation to significantly reduce total response time.
 * Previously, each TTS call waited for the previous one to finish (sequential execution),
 * which took a long time (e.g., 50 questions × 2s = ~100s).
 * 
 * Now, all TTS requests run in parallel using Promise.all, so total time is much faster (~30s).
 * If Murf API rate limits in future, you can add concurrency control using `p-limit`.
 */
async function injectTTS(lessons: Lesson[], voiceID: string) {
  type Question = {
    question: string;
    phonetic: string;
    tts_url: string;
    answer_type: "multiple_choice" | "text_input";
    correct_answer: string;
    options?: string[];
  };

  const ttsTasks: Promise<void>[] = [];

  for (const lesson of lessons) {
    const questions = lesson.questions as Question[];

    for (const question of questions) {
      const task = generateTTS(question.phonetic, voiceID).then((ttsUrl) => {
        question.tts_url = ttsUrl;
      });
      ttsTasks.push(task);
    }
  }

  await Promise.all(ttsTasks); // Run all TTS calls in parallel
  return lessons;
}

/**
 * slower Version (Sequential)
 * 
 * This version made one TTS request at a time, which is slow.
 * Each `await` would block the next call.
 *
 * async function injectTTS(lessons: Lesson[], voiceID: string) {
 *   for (const lesson of lessons) {
 *     const questions = lesson.questions as Question[];
 *     for (const question of questions) {
 *       const tts = await generateTTS(question.phonetic, voiceID);
 *       question.tts_url = tts;
 *     }
 *   }
 *   return lessons;
 * }
 */

// Main function to generate lesson course with TTS
export async function generateCourseWithTTS(data: IUserPreference & {userId:string}) {
  try {
    if (!GOOGLE_KEY) {
      return {
        status: "401",
        data: "Please get an API key before accessing Gemini model",
      };
    }

    const genAI = new GoogleGenerativeAI(GOOGLE_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const systemPrompt = lessonPrompt(data);
    const result = await model.generateContent(systemPrompt);

    let raw = result.response.text();
    raw = raw.replace(/```json|```|\n/g, "").trim();

    const parsed = JSON.parse(raw);
    const voiceID = getVoiceID(data.native_lang);

    const updatedLessons = await injectTTS(parsed.lessons, voiceID);

    
    for (const lesson of updatedLessons) {
      await prisma.lesson.create({
      data: {
        userId: 3,
        title: lesson.title,
        questions: lesson.questions!
      },
      });
    }

    await prisma.$disconnect();
    return { lessons: updatedLessons };

  } catch (error) {
    console.error("Error generating course:", error);
    return null;
  }
}
