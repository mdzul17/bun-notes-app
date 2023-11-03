import { NotFoundError, t } from "elysia";
import { PrismaClient } from "@prisma/client";
import { InvariantError } from "../exceptions/InvariantError";
import { AuthorizationError } from "../exceptions/AuthorizationError";
import { collaborationsService } from "./CollaborationsService";

const db = new PrismaClient();

interface commentPayload {
    id: string,
    body: string,
    owner: string,
    noteId: string
}

interface updateCommentPayload {
    id: string,
    body: string,
}

export const commentsService = {
    getComments: async (owner: string) => {
        const comments = await db.comments.findMany({
            where: {
                owner: {
                    equals: owner
                }
            }
        });

        if (!comments) throw new NotFoundError("This user has no comments!")

        return comments
    },

    createComment: async (payload: commentPayload) => {
        const comment = await db.comments.create({
            data: {
                id: payload.id,
                body: payload.body,
                owner: payload.owner,
                noteId: payload.noteId
            },
            select: {
                id: true
            }
        });

        if (!comment) throw new InvariantError("Comment failed to be added")
    },

    updateComment: async (payload: updateCommentPayload) => {
        const updated_at = new Date();

        const comment = await db.comments.update({
            where: {
                id: payload.id,
            },
            data: {
                body: payload.body,
                updated_at: updated_at
            }
        });

        if (!comment) throw new InvariantError("User failed to be added")
    },

    getCommentById: async (id: string) => {
        const comment = await db.comments.findFirst({
            where: {
                id: {
                    equals: id
                }
            }
        })

        if (!comment) throw new NotFoundError('Comment is not found!')

        return comment
    },

    deleteComment: async ({ params: { id } }) => {
        const comment =
            await db.comments.delete({
                where: {
                    id: id
                }
            })

        if (!comment) throw new NotFoundError('Comment is not found!')
    },

    verifyCommentOwner: async (commentId: string, userId: string) => {
        const comment = await db.comments.findFirst({
            where: {
                id: {
                    equals: commentId
                },
            }
        })

        if (!comment) throw new NotFoundError("Comment is not found!")

        if (comment.owner !== userId) throw new AuthorizationError('You have no access!')
    },
};
