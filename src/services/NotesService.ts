import { NotFoundError, t } from "elysia";
import { PrismaClient } from "@prisma/client";
import { InvariantError } from "../exceptions/InvariantError";
import { AuthorizationError } from "../exceptions/AuthorizationError";

const db = new PrismaClient();

interface notePayload {
    id: string,
    title: string,
    body: string,
    tags: string,
    owner: string
}

export const notesService = {
    getNotes: async (owner: string) => {
        const notes = db.notes.findMany({
            where: {
                owner: {
                    contains: owner
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

    verifyNoteOwner: async (userId: string) => {
        const owner = await db.users.findFirst({
            where: {
                id: {
                    equals: userId
                }
            }
        })

        if (!owner) throw new AuthorizationError('You have no access!')
    }
};
