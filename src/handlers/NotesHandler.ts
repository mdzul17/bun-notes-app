import { t } from "elysia";
import { v4 as uuidv4 } from "uuid"
import { notesService } from "../services/NotesService";
import path from "path";

export const notesHandler = {
    getNotes: async ({ jwt, cookie: { auth }, bearer }) => {
        console.log(auth + " " + bearer)
        const { id: userId } = auth ? await jwt.verify(auth) : await jwt.verify(bearer);
        const notes = await notesService.getNotes(userId)

        return {
            status: "success",
            data: notes
        }
    },

    createNote: async ({ jwt, body, set, cookie: { auth } }) => {

        const { id: userId } = await jwt.verify(auth);

        const id = uuidv4();
        const note = await notesService.createNote(
            {
                id: `notes-${id}`,
                owner: userId,
                ...body
            }
        );
        set.status = 201;
        return {
            status: "success",
            message: `Note ${body.title} successfully created!`,
            data: {
                id: note
            }
        };
    },

    updateNote: async ({ jwt, body, set, cookie: { auth }, params: { id } }) => {

        const { id: userId } = await jwt.verify(auth);
        await notesService.verifyNoteAccess(id, userId);

        await notesService.updateNote(
            {
                id: id,
                ...body
            }
        );
        set.status = 201;
        return {
            status: "success",
            message: `Note ${body.title} successfully updated!`
        };
    },

    getNoteById: async ({ jwt, set, cookie: { auth }, params: { id } }) => {
        const { id: userId } = await jwt.verify(auth)
        await notesService.verifyNoteAccess(id, userId)

        const note = await notesService.getNoteById(id)

        set.status = 200;
        return {
            status: "success",
            data: note
        }
    },

    deleteNote: async ({ jwt, set, cookie: { auth }, params: { id } }) => {
        const { id: userId } = await jwt.verify(auth)
        await notesService.verifyNoteAccess(id, userId)

        await notesService.deleteNote(id)

        set.status = 200;
        return {
            status: "success",
            message: `Note successfully deleted!`
        }
    },

    uploadCover: async ({ jwt, set, cookie: { auth }, params: { id }, body: { cover } }) => {
        const { id: userId } = await jwt.verify(auth)

        await notesService.verifyNoteAccess(id, userId)
        const noteTitle = await notesService.getNoteTitleById(id)

        const dirLocation = path.dirname(import.meta.dir)
        const fileLocation = "/storage/image"
        const filename = +new Date() + noteTitle
        const fileType = cover.type.split('/')[1]

        await Bun.write(path.join(dirLocation, `${fileLocation}/${filename}.${fileType}`), cover);

        const coverUrl = `http://${process.env.BUN_HOST}:${process.env.BUN_PORT}/notes/file/images/${filename}`

        await notesService.addNoteCover(id, coverUrl)

        set.status = 201

        return {
            status: "success",
            message: `Note Cover successfully added!`
        }
    },

    validateCreateNote: t.Object({
        title: t.String(),
        body: t.String(),
        tags: t.String(),
    }),

    validateCoverNote: t.Object({
        cover: t.File({
            type: 'image',
            minSize: 5000,
            maxSize: 500000
        })
    })
};
