import { t } from "elysia";
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

export const notesController = {
    getNotes: async ({ query }) => {
        return db.notes.findMany({
            where: {
                title: {
                    contains: query.title
                }
            }
        });
    },

    createNote: async ({ body, set }) => {
        await db.notes.create({
            data: {
                id: body.id,
                title: body.title,
                body: body.body,
                tags: body.tags,
                owner: body.owner,
            }
        });
        set.status = 201;
        return `Data ${body.title} successfully created!`;
    },

    validateCreateNote: t.Object({
        id: t.String(),
        title: t.String(),
        body: t.String(),
        tags: t.String(),
        owner: t.String()
    })
};
