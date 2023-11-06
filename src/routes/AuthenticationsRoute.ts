import { authenticationsHandler } from "../handlers/AuthenticationsHandler";
import { registerMiddleware } from "../middleware/RegisterMiddleware";

export function configureAuthenticationsRoutes(app) {
    return app
        .post("/", authenticationsHandler.postAuthentications)
        .put("/", authenticationsHandler.putAuthentications)
        .post("/login", authenticationsHandler.loginUser)
        .post("/register", authenticationsHandler.registerUser, { beforeHandle: registerMiddleware, body: authenticationsHandler.registerPayload })
}
