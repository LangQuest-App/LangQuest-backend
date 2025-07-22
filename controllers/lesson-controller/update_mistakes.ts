import { PrismaClient } from "../../generated/prisma";

export async function updateMistakesandStatus(data:any){
    const prisma = new PrismaClient();
    try {
        // update the lesson's status to attempted
        const lessonID = data.lesson_id;
        await prisma.lesson.update({
            where: { id: lessonID },
            data: { attempted: true }
        });

        // create a new row in mistakes table and add data.questions to question and data.lesson_id to mistakes.lessonId
        await prisma.mistakes.create({
            data: {
                questions: data.questions,
                lessonId: data.lesson_id
            }
        });
        return { success: true };
    } catch (error:any) {
        return { success: false, error: error.message || error };
    } finally {
        await prisma.$disconnect();
    }
}
