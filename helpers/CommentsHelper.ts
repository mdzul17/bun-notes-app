import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

export const commentsTableTestHelpers = {
    addNotes: async ({
        id = `comment-123`,
        body = 'dicoding',
        owner = `user-123`,
        note_id = 'note-123'
    }) => {
        await db.comments.create({
            data: {
                id: id,
                body: body,
                owner: owner,
                noteId: note_id
            }
        })
    },
    cleanTable: async () => {
        await db.comments.deleteMany()
    },
    getNotesById: async ({
        id = `comment-123`,
        body = 'dicoding',
    }) => {
        await db.comments.update({
            where: {
                id: id
            },
            data: {
                body: body,
            }
        })
    }
}