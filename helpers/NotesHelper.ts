import { PrismaClient } from "@prisma/client";
import { CacheService } from "../src/utils/CacheService";

const db = new PrismaClient();

export const notesTableTestHelper = {
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
        const cacheService = new CacheService()
        await cacheService.delete('getNotes')
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