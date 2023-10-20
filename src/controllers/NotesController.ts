import { t } from "elysia";
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid"
import { cookie } from "@elysiajs/cookie"

const db = new PrismaClient();

export const notesController = {
    getNotes: async ({ query, cookie }) => {
        return db.notes.findMany({
            where: {
                title: {
                    contains: query.title
                }
            }
        });
    },

    createNote: async ({ body, set, cookie }) => {
        const id = uuidv4();
        await db.notes.create({
            data: {
                id: `notes-${id}`,
                title: body.title,
                body: body.body,
                tags: body.tags,
                owner: body.owner,
            }
        });
        set.status = 201;
        return `Data ${body.title} successfully created!`;
    },

    getNoteById: async ({ set, cookie, params: { id } }) => {
        const note = await db.notes.findFirst({
            where: {
                id: {
                    equals: id
                }
            }
        })

        if (!note) {
            set.status = 404;
            return `Note tidak tersedia!`
        }

        set.status = 200;
        return note
    },

    deleteNote: async ({ set, cookie, params: { id } }) => {
        try {
            await db.notes.delete({
                where: {
                    id: id
                }
            })
            return `Note deleted successfully!`
        } catch (error) {
            set.status = 404
            return `Note not found!`
        }
    },

    validateCreateNote: t.Object({
        title: t.String(),
        body: t.String(),
        tags: t.String(),
        owner: t.String()
    })
};
