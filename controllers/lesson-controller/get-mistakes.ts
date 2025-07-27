import { prisma } from "../../utils/prisma";

// Get mistakes for a specific lesson
export async function getMistakesOfLesson(lessonId: string) {
  const mistakes = await prisma.mistakes.findMany({ where: { lessonId } });
  // Flatten all questions from all mistakes rows
  return mistakes.flatMap((mistake) => {
    if (!Array.isArray(mistake.questions)) return [];
    return mistake.questions.map((q: any) => ({
      tts_url: q.tts_url,
      phonetic: q.phonetic,
      question: q.question,
      correct_answer: q.correct_answer
    }));
  });
}


export async function getAllMistakes() {
  const mistakes = await prisma.mistakes.findMany({
    select: {
      questions: true,
    },
  });

  return mistakes.flatMap((mistake) => mistake.questions);
}
