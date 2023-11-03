import { NotFoundError, t } from "elysia";
import { PrismaClient } from "@prisma/client";
import { InvariantError } from "../exceptions/InvariantError";
import { AuthorizationError } from "../exceptions/AuthorizationError";
import { collaborationsService } from "./CollaborationsService";

const db = new PrismaClient();

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
        const notes = await db.notes.findMany({
            where: {
                owner: {
                    equals: owner
                }
            }
        });

        if (!notes) throw new NotFoundError("This user has no notes!")

        return notes
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
    },

    getNoteById: async (id: string) => {
        const note = await db.notes.findFirst({
            where: {
                id: {
                    equals: id
                }
            }
        })

        if (!note) throw new NotFoundError('Note is not found!')

        return note
    },

    deleteNote: async ({ params: { id } }) => {
        const note =
            await db.notes.delete({
                where: {
                    id: id
                }
            })

        if (!note) throw new NotFoundError('Note is not found!')
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
