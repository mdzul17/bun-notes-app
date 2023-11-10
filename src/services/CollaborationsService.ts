import { PrismaClient } from "@prisma/client";
import { InvariantError } from "../exceptions/InvariantError";

const db = new PrismaClient();

interface collaborationPayload {
    id: string,
    note_id: string,
    user_id: string
}

interface verifiedPayload {
    note_id: string,
    user_id: string
}
interface deletePayload {
    id: string,
    note_id: string,
    user_id: string
}

export const collaborationsService = {
    addCollaboration: async (payload: collaborationPayload) => {
        const user = await db.collaborations.create({
            data: {
                id: payload.id,
                note_id: payload.note_id,
                user_id: payload.user_id
            },
        });

        if (!user) throw new InvariantError("Collaboration failed to be added")
        return user;
    },

    deleteCollaboration: async (payload: deletePayload) => {
        const result = await db.collaborations.delete({
            where: {
                id: payload.id,
                note_id: payload.note_id,
                user_id: payload.user_id
            },
        });

        if (!result) throw new InvariantError("Collaboration failed to be deleted")
    },

    verifyCollaboration: async (payload: verifiedPayload) => {
        const result = await db.collaborations.findFirst({
            where: {
                note_id: {
                    equals: payload.note_id
                },
                user_id: {
                    equals: payload.user_id
                }
            },
            select: {
                id: true
            }
        });

        if (!result) throw new InvariantError("Collaboration failed to be verified")

        return result.id
    }
};
