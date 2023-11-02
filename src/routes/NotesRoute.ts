import { notesHandler } from "../handlers/NotesHandler";
import { apiMiddleware } from "../middleware/ApiMiddleware";

export function configureNotesRoutes(app) {
    return app
        .get("/", notesHandler.getNotes, {
            beforeHandle: apiMiddleware
        })
        .guard({ body: notesHandler.validateCreateNote }, (guardApp) =>
            guardApp
                .post("/", notesHandler.createNote, { beforeHandle: apiMiddleware })
        )
        .get("/:id", notesHandler.getNoteById, { beforeHandle: apiMiddleware })
        .delete("/:id", notesHandler.deleteNote, { beforeHandle: apiMiddleware })
}
