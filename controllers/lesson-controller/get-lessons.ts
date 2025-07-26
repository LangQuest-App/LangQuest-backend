import { PrismaClient } from "@prisma/client";
import { prisma } from "../../utils/prisma";
export default async function getLessonsOfUser(id:string){
    try {
        const user = await prisma.user.findUnique({
            where: { id: parseInt(id) },
            include: { lessons: true }
        });
        return user?.lessons || [];
    } catch (error) {
        return { success: false, error: (error instanceof Error ? error.message : String(error)) };
    }
}