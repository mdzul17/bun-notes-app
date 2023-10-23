import { t } from "elysia";
import { v4 as uuidv4 } from "uuid"
import { notesService } from "../services/NotesService";

export const notesHandler = {
    getNotes: async ({ jwt, cookie: { auth } }) => {
        const userId = await jwt.verify(auth);

        return await notesService.getNotes(userId)
    },

    createNote: async ({ jwt, body, set, cookie: { auth } }) => {

        const userId = await jwt.verify(auth);

        const id = uuidv4();
        await notesService.createNote(
            {
                id: `notes-${id}`,
                owner: userId,
                ...body
            }
        );
        set.status = 201;
        return `Note ${body.title} successfully created!`;
    },

    getNoteById: async ({ jwt, set, cookie: { auth }, params: { id } }) => {
        const userId = await jwt.verify(auth)
        await notesService.verifyNoteOwner(userId)

        const note = await notesService.getNoteById(id)

        set.status = 200;
        return note
    },

    deleteNote: async ({ jwt, set, cookie: { auth }, params: { id } }) => {
        const userId = await jwt.verify(auth)
        await notesService.verifyNoteOwner(userId)

        await notesService.deleteNote(id)

        set.status = 200;
        return `Note successfully deleted!`
    },

    validateCreateNote: t.Object({
        title: t.String(),
        body: t.String(),
        tags: t.String(),
        owner: t.String()
    })
};
