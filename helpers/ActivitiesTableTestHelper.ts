import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

export const activitiesTableTestHelper = {
    cleanTable: async () => {
        await db.activities.deleteMany()
    },
}