import { notesController } from "../controllers/NotesController";

export function configureNotesRoutes(app) {
    return app
        .get("/", notesController.getNotes)
        .guard({ body: notesController.validateCreateNote }, (guardApp) =>
            guardApp
                .post("/", notesController.createNote)
        )
        .get("/:id", notesController.getNoteById)
        .delete("/:id", notesController.deleteNote)
}
