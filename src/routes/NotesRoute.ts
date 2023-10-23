import { notesHandler } from "../handlers/NotesHandler";

export function configureNotesRoutes(app) {
    return app
        .get("/", notesHandler.getNotes)
        .guard({ body: notesHandler.validateCreateNote }, (guardApp) =>
            guardApp
                .post("/", notesHandler.createNote)
        )
        .get("/:id", notesHandler.getNoteById)
        .delete("/:id", notesHandler.deleteNote)
}
