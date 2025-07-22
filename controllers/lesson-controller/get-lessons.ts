import { PrismaClient } from "../../generated/prisma";
export default async function getLessonsOfUser(id:string){
    const prisma = new PrismaClient();
    const user = await prisma.user.findUnique({
        where: { id: parseInt(id) },
        include: { lessons: true }
    });
    return user?.lessons || [];
}