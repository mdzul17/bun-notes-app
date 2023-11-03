import { t } from "elysia";
import { commentsHandler } from "../handlers/CommentsHandler";
import { apiMiddleware } from "../middleware/ApiMiddleware";

export function configureCommentsRoutes(app) {
    return app
        .get("/", commentsHandler.getComments, {
            beforeHandle: apiMiddleware
        })
        .post("/", commentsHandler.createComment, { beforeHandle: apiMiddleware, body: commentsHandler.validateCreateComment })
        .put("/:id", commentsHandler.updateComment, { beforeHandle: apiMiddleware })
        .get("/:id", commentsHandler.getCommentById, { beforeHandle: apiMiddleware })
        .delete("/:id", commentsHandler.deleteComment, { beforeHandle: apiMiddleware })
}
