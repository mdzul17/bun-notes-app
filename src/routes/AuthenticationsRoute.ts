import { authenticationsHandler } from "../handlers/AuthenticationsHandler";

export function configureAuthenticationsRoutes(app) {
    return app
        .post("/", authenticationsHandler.postAuthentications)
        .put("/", authenticationsHandler.putAuthentications)
}
