import { t } from "elysia";
import { notesHandler } from "../handlers/NotesHandler";
import { apiMiddleware } from "../middleware/ApiMiddleware";
import { fileMiddleware } from "../middleware/FileMiddleware";

export function configureNotesRoutes(app) {
    return app
        .get("/", notesHandler.getNotes, {
            beforeHandle: apiMiddleware
        })
        .post("/", notesHandler.createNote, { beforeHandle: apiMiddleware, body: notesHandler.validateCreateNote })
        .put("/:id", notesHandler.updateNote, { beforeHandle: apiMiddleware })
        .get("/:id", notesHandler.getNoteById, { beforeHandle: apiMiddleware })
        .delete("/:id", notesHandler.deleteNote, { beforeHandle: apiMiddleware })
        .post("/:id/upload", notesHandler.uploadCover, {
            body: notesHandler.validateCoverNote,
            beforeHandle: [apiMiddleware, fileMiddleware],
        })
        .post("/:id/like", notesHandler.likeNote, {
            beforeHandle: [apiMiddleware]
        })
}
