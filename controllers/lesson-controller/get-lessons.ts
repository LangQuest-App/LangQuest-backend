import { PrismaClient } from "../../generated/prisma";
export default async function getLessonsOfUser(id:string){
    const prisma = new PrismaClient();
    try {
        const user = await prisma.user.findUnique({
            where: { id: parseInt(id) },
            include: { lessons: true }
        });
        return user?.lessons || [];
    } catch (error) {
        return { success: false, error: (error instanceof Error ? error.message : String(error)) };
    } finally {
        await prisma.$disconnect();
    }
}