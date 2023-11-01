import { collaborationsHandler } from "../handlers/CollaborationsHandler";
import { apiMiddleware } from "../middleware/ApiMiddleware";

export function configureCollaborationsRoutes(app) {
    return app
        .post("/", collaborationsHandler.addCollaboration, {
            beforeHandle: apiMiddleware
        })
        .delete("/", collaborationsHandler.deleteCollaboration, {
            beforeHandle: apiMiddleware
        })
}
