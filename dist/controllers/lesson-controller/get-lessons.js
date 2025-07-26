"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = getLessonsOfUser;
const prisma_1 = require("../../utils/prisma");
async function getLessonsOfUser(id) {
    try {
        const user = await prisma_1.prisma.user.findUnique({
            where: { id: parseInt(id) },
            include: { lessons: true }
        });
        return user?.lessons || [];
    }
    catch (error) {
        return { success: false, error: (error instanceof Error ? error.message : String(error)) };
    }
}
