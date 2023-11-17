import { NotFoundError, t } from "elysia";
import { PrismaClient } from "@prisma/client";
import { InvariantError } from "../exceptions/InvariantError";
import { AuthorizationError } from "../exceptions/AuthorizationError";
import { CacheService } from "../utils/CacheService";

const db = new PrismaClient();
const cacheService = new CacheService()

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
        try {
            const isCached = await cacheService.get(`getComments`);
            return {
                data: JSON.parse(isCached),
                cache: true
            }
        } catch (error) {
            const comments = await db.comments.findMany({
                where: {
                    owner: {
                        equals: owner
                    }
                }
            });

            if (!comments) throw new NotFoundError("This user has no comments!")

            await cacheService.set(`getComments`, JSON.stringify(comments))

            return {
                data: comments,
                cache: false
            }
        }
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
        await cacheService.delete(payload.id)
    },

    updateComment: async (payload: updateCommentPayload) => {
        const updated_at = new Date();

        const comment = await db.comments.update({
            where: {
                id: payload.id,
            },
            data: {
                body: payload.body,
                updated_at: updated_at,
                is_edit: true
            }
        });

        if (!comment) throw new InvariantError("User failed to be added")

        await cacheService.delete(`Comments:${payload.id}`)
        await cacheService.delete(`getComments`)
    },

    getCommentById: async (id: string) => {
        try {
            const isCached = await cacheService.get(`Comments:${id}`)
            return {
                data: JSON.parse(isCached),
                cache: true
            }
        } catch (error) {
            const comment = await db.comments.findFirst({
                where: {
                    id: {
                        equals: id
                    }
                }
            })

            if (!comment) throw new NotFoundError('Comment is not found!')

            await cacheService.set(`Comments:${id}`, JSON.stringify(comment))

            return {
                data: comment,
                cache: false
            }
        }
    },

    deleteComment: async ({ params: { id } }) => {
        const comment =
            await db.comments.delete({
                where: {
                    id: id
                }
            })

        if (!comment) throw new NotFoundError('Comment is not found!')
        await cacheService.delete(`Comments:${id}`)
        await cacheService.delete(`getComments`)
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
