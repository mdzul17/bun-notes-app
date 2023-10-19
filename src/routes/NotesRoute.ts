import { Elysia, t } from "elysia";
import { notesController } from "../controllers/NotesController";

export function configureNotesRoutes(app: Elysia) {
    return app
        .get("/", notesController.getNotes)
        .guard({ body: notesController.validateCreateNote }, (guardApp) =>
            guardApp.post("/", notesController.createNote)
        );
}
