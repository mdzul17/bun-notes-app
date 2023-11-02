import { t } from "elysia";
import { v4 as uuidv4 } from "uuid"
import { notesService } from "../services/NotesService";

export const notesHandler = {
    getNotes: async ({ jwt, cookie: { auth }, bearer }) => {
        console.log(auth + " " + bearer)
        const { id: userId } = auth ? await jwt.verify(auth) : await jwt.verify(bearer);
        const notes = await notesService.getNotes(userId)

        return {
            status: 200,
            data: notes
        }
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
        return {
            status: 201,
            message: `Note ${body.title} successfully created!`
        };
    },

    getNoteById: async ({ jwt, set, cookie: { auth }, params: { id } }) => {
        const userId = await jwt.verify(auth)
        await notesService.verifyNoteAccess(id, userId)

        const note = await notesService.getNoteById(id)

        set.status = 200;
        return {
            status: 200,
            data: note
        }
    },

    deleteNote: async ({ jwt, set, cookie: { auth }, params: { id } }) => {
        const userId = await jwt.verify(auth)
        await notesService.verifyNoteAccess(id, userId)

        await notesService.deleteNote(id)

        set.status = 200;
        return {
            status: 200,
            message: `Note successfully deleted!`
        }
    },

    validateCreateNote: t.Object({
        title: t.String(),
        body: t.String(),
        tags: t.String(),
        owner: t.String()
    })
};
