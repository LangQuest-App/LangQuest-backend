"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateMistakesandStatus = updateMistakesandStatus;
const prisma_1 = require("../../utils/prisma");
async function updateMistakesandStatus(data) {
    try {
        // update the lesson's status to attempted
        const lessonID = data.lesson_id;
        await prisma_1.prisma.lesson.update({
            where: { id: lessonID },
            data: { attempted: true }
        });
        // create a new row in mistakes table and add data.questions to question and data.lesson_id to mistakes.lessonId
        await prisma_1.prisma.mistakes.create({
            data: {
                questions: data.questions,
                lessonId: data.lesson_id
            }
        });
        return { success: true };
    }
    catch (error) {
        return { success: false, error: error.message || error };
    }
}
