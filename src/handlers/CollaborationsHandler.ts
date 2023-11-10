import { t } from "elysia";
import { v4 as uuidv4 } from "uuid"
import { collaborationsService } from "../services/CollaborationsService";
import { notesService } from "../services/NotesService";

export const collaborationsHandler = {
    addCollaboration: async ({ jwt, body, set, cookie: { auth } }) => {
        await jwt.verify(auth);

        const id = uuidv4();
        await collaborationsService.addCollaboration(
            {
                id: id,
                note_id: `notes-${id}`,
                user_id: body.user_id
            }
        );
        set.status = 201;
        return {
            status: "success",
            message: `Collaboration ${body.title} successfully added!`
        };
    },

    deleteCollaboration: async ({ jwt, set, cookie: { auth }, body: { note_id } }) => {
        const userId = await jwt.verify(auth)

        await notesService.verifyNoteAccess(note_id, userId)
        const id = await collaborationsService.verifyCollaboration({ note_id, user_id: userId })
        await collaborationsService.deleteCollaboration({ id, note_id, user_id: userId })

        set.status = 200;
        return {
            status: "success",
            message: `Collaboration successfully deleted!`
        }
    },
};
