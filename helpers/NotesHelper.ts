import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

export const notes = {
    addNotes: async ({
        id = `note-123`,
        title = 'dicoding',
        body = 'dicoding',
        tags = 'Dicoding Indonesia',
        owner = `user-123`
    }) => {
        await db.notes.create({
            data: {
                id: id,
                title: title,
                body: body,
                tags: tags,
                owner: owner
            }
        })
    },
    cleanTable: async () => {
        await db.notes.deleteMany()
    },
    getNotesById: async ({
        id = `note-123`,
        title = 'dicoding',
        body = 'dicoding',
        tags = 'Dicoding Indonesia'
    }) => {
        await db.notes.update({
            where: {
                id: id
            },
            data: {
                title: title,
                body: body,
                tags: tags
            }
        })
    }
}