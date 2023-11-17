import { t } from "elysia";
import { v4 as uuidv4 } from "uuid"
import { notesService } from "../services/NotesService";
import { activitiesService } from "../services/ActivitiesService";
import path from "path";

export const notesHandler = {
    getNotes: async ({ userToken: { id: userId }, set }) => {
        const { data, cache } = await notesService.getNotes(userId)

        if (cache) {
            set.headers[
                'X-Data-Source'
            ] = "cache"
        }

        await activitiesService.addActivity({ user_id: userId, activity: `User access the notes` })

        return {
            status: "success",
            data
        }
    },

    createNote: async ({ body, set, userToken: { id: userId } }) => {

        const id = uuidv4();
        const note = await notesService.createNote(
            {
                id: `notes-${id}`,
                owner: userId,
                ...body
            }
        );

        await activitiesService.addActivity({ user_id: userId, activity: `User create a note` })
        set.status = 201;
        return {
            status: "success",
            message: `Note ${body.title} successfully created!`,
            data: {
                id: note
            }
        };
    },

    updateNote: async ({ body, set, userToken: { id: userId }, params: { id } }) => {
        await notesService.verifyNoteAccess(id, userId);

        await notesService.updateNote(
            {
                id: id,
                ...body
            }
        );

        await activitiesService.addActivity({ user_id: userId, activity: `User update the note ${id}` })
        set.status = 201;
        return {
            status: "success",
            message: `Note ${body.title} successfully updated!`
        };
    },

    getNoteById: async ({ set, userToken: { id: userId }, params: { id } }) => {
        await notesService.verifyNoteAccess(id, userId)

        const { data, cache } = await notesService.getNoteById(id)

        if (cache) {
            set.headers[
                'X-Data-Source'
            ] = "cache"
        }

        await activitiesService.addActivity({ user_id: userId, activity: `User access the note ${id}` })

        set.status = 200;
        return {
            status: "success",
            data: data
        }
    },

    deleteNote: async ({ set, userToken: { id: userId }, params: { id } }) => {
        await notesService.verifyNoteAccess(id, userId)

        await notesService.deleteNote(id)
        await activitiesService.addActivity({ user_id: userId, activity: `User delete note ${id}` })

        set.status = 200;
        return {
            status: "success",
            message: `Note successfully deleted!`
        }
    },

    uploadCover: async ({ set, params: { id }, body: { cover }, userToken: { id: userId } }) => {

        await notesService.verifyNoteAccess(id, userId)
        const noteTitle = await notesService.getNoteTitleById(id)

        const dirLocation = path.dirname(import.meta.dir)
        const fileLocation = "/storage/image"
        const filename = +new Date() + noteTitle.replace(" ", "_")
        const fileType = cover.type.split('/')[1]

        await Bun.write(path.join(dirLocation, `${fileLocation}/${filename}.${fileType}`), cover);

        const coverUrl = `http://${process.env.BUN_HOST}:${process.env.BUN_PORT}/notes/file/images/${filename}`

        await notesService.addNoteCover(id, coverUrl)
        await activitiesService.addActivity({ user_id: userId, activity: `User upload the cover for ${id}` })

        set.status = 201

        return {
            status: "success",
            message: `Note Cover successfully added!`
        }
    },

    likeNote: async ({ set, params: { id }, userToken: { id: userId } }) => {

        await notesService.verifyIsNoteAvailable(id)
        const isLike = await notesService.verifyLikeNote(id, userId)

        if (isLike || isLike) {
            await notesService.likeNote(id, userId)
            await activitiesService.addActivity({ user_id: userId, activity: `User like the note ${id}` })

            set.status = 200
            return {
                status: 'success',
                message: 'Like has been added'
            }
        } else {
            await notesService.deleteLikeNote(id, userId)
            await activitiesService.addActivity({ user_id: userId, activity: `User unlike the note ${id}` })

            set.status = 200
            return {
                status: 'success',
                message: 'Like has been deleted'
            }
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
