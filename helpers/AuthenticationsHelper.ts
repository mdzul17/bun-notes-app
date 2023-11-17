import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

export const authentications = {
    addNotes: async (token: string) => {
        await db.authentications.create({
            data: {
                token: token
            }
        })
    },
    cleanTable: async () => {
        await db.authentications.deleteMany()
    },
    findToken: async (token: string) => {
        await db.authentications.findFirst({
            where: {
                token: token
            }
        })
    }
}