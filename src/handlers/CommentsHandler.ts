import { t } from "elysia";
import { v4 as uuidv4 } from "uuid"
import { commentsService } from "../services/CommentsService";

export const commentsHandler = {
    getComments: async ({ userToken: { id: userId } }) => {
        const comments = await commentsService.getComments(userId)

        return {
            status: "success",
            data: comments
        }
    },

    createComment: async ({ body, set, userToken: { id: userId } }) => {

        const id = uuidv4();
        const comment = await commentsService.createComment(
            {
                id: `comments-${id}`,
                owner: userId,
                ...body
            }
        );
        set.status = 201;
        return {
            status: "success",
            message: `Comment ${body.title} successfully created!`,
            data: {
                id: comment
            }
        };
    },

    updateComment: async ({ body, set, userToken: { id: userId }, params: { id } }) => {
        await commentsService.verifyCommentOwner(id, userId);

        await commentsService.updateComment(
            {
                id: id,
                ...body
            }
        );
        set.status = 201;
        return {
            status: "success",
            message: `Comment ${body.title} successfully updated!`
        };
    },

    getCommentById: async ({ set, userToken: { id: userId }, params: { id } }) => {
        await commentsService.verifyCommentOwner(id, userId)

        const comment = await commentsService.getCommentById(id)

        set.status = 200;
        return {
            status: "success",
            data: comment
        }
    },

    deleteComment: async ({ set, userToken: { id: userId }, params: { id } }) => {
        await commentsService.verifyCommentOwner(id, userId)

        await commentsService.deleteComment(id)

        set.status = 200;
        return {
            status: "success",
            message: `Comment successfully deleted!`
        }
    },

    validateCreateComment: t.Object({
        title: t.String(),
        body: t.String(),
        tags: t.String(),
    }),

    validateCoverComment: t.Object({
        cover: t.File({
            type: 'image',
            minSize: 5000,
            maxSize: 500000
        })
    })
};
