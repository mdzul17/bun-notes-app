import { authenticationsController } from "../controllers/AuthenticationsController";

export function configureAuthenticationsRoutes(app) {
    return app
        .post("/", authenticationsController.postAuthentications)
        .put("/", authenticationsController.putAuthentications)
}
