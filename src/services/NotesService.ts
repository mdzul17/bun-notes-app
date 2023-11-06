import { NotFoundError, t } from "elysia";
import { PrismaClient } from "@prisma/client";
import { InvariantError } from "../exceptions/InvariantError";
import { AuthorizationError } from "../exceptions/AuthorizationError";
import { collaborationsService } from "./CollaborationsService";
import { CacheService } from "../utils/CacheService";

const db = new PrismaClient();
const cacheService = new CacheService();

interface notePayload {
    id: string,
    title: string,
    body: string,
    tags: string,
    owner: string
}

interface updateNotePayload {
    title: string,
    body: string,
    tags: string,
    owner: string,
    id: string,
    cover: any
}

export const notesService = {
    getNotes: async (owner: string) => {
        try {
            const isCached = await cacheService.get(`getNotes`)
            return {
                data: JSON.parse(isCached), cache: true
            }
        } catch (error) {
            const notes = await db.notes.findMany({
                where: {
                    owner: {
                        equals: owner
                    }
                }
            });

            if (!notes) throw new NotFoundError("This user has no notes!")

            await cacheService.set(`getNotes`, JSON.stringify(notes))
            return {
                data: notes,
                cache: false
            }
        }
    },

    createNote: async (payload: notePayload) => {
        const note = await db.notes.create({
            data: {
                id: payload.id,
                title: payload.title,
                body: payload.body,
                tags: payload.tags,
                owner: payload.owner,
            },
            select: {
                id: true
            }
        });

        if (!note) throw new InvariantError("User failed to be added")

        await cacheService.delete(`getNotes`)
        return note.id
    },

    updateNote: async (payload: updateNotePayload) => {
        const updated_at = new Date();

        const note = await db.notes.update({
            where: {
                id: payload.id,
            },
            data: {
                title: payload.title,
                body: payload.body,
                tags: payload.tags,
                updated_at: updated_at
            }
        });

        if (!note) throw new InvariantError("User failed to be added")

        await cacheService.delete(`getNotes`)
        await cacheService.delete(`Notes:${payload.id}`)
    },

    getNoteById: async (id: string) => {
        try {
            const isCached = await cacheService.get(`Notes:${id}`)
            return {
                data: JSON.parse(isCached),
                cache: true
            }
        } catch (error) {
            const note = await db.notes.findFirst({
                where: {
                    id: {
                        equals: id
                    }
                }
            })

            if (!note) throw new NotFoundError('Note is not found!')
            await cacheService.set(`Notes:${note.id}`, JSON.stringify(note))

            return {
                data: note,
                cache: false
            }
        }
    },

    deleteNote: async (id: string) => {
        const note =
            await db.notes.delete({
                where: {
                    id: id
                }
            })

        if (!note) throw new NotFoundError('Note is not found!')

        await cacheService.delete(`Notes:${id}`)
        await cacheService.delete(`getNotes`)
    },

    verifyNoteOwner: async (noteId: string, userId: string) => {
        const note = await db.notes.findFirst({
            where: {
                id: {
                    equals: noteId
                },
            }
        })

        if (!note) throw new NotFoundError("Note is not found!")

        if (note.owner !== userId) throw new AuthorizationError('You have no access!')
    },

    verifyNoteAccess: async (noteId: string, userId: string) => {
        try {
            await notesService.verifyNoteOwner(noteId, userId)
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw error
            }

            try {
                await collaborationsService.verifyCollaboration({ note_id: noteId, user_id: userId })
            } catch (error) {
                throw error
            }
        }
    },

    getNoteTitleById: async (id: string) => {
        const noteTitle = await db.notes.findFirst({
            where: {
                id: {
                    equals: id
                }
            },
            select: {
                title: true
            }
        })

        return noteTitle.title
    },

    addNoteCover: async (id: string, coverUrl: string) => {
        const note = await db.notes.update({
            where: {
                id: id
            },
            data: {
                cover: coverUrl
            }
        })

        if (!note) throw new NotFoundError("Failed to update cover. Note is not available!")
    }
};
