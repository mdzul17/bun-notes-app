import { usersHandler } from "../handlers/UsersHandler";
import { apiMiddleware } from "../middleware/ApiMiddleware";
import { registerMiddleware } from "../middleware/RegisterMiddleware";

export function configureUsersRoutes(app) {
    return app
        .get("/", usersHandler.getUsers)
        .guard({ body: usersHandler.validateCreateUser }, (guardApp) =>
            guardApp
                .post("/", usersHandler.createUser, { beforeHandle: registerMiddleware })
        )
        .get("/:id", usersHandler.getUserById, {
            beforeHandle: apiMiddleware
        })
        .delete("/:id", usersHandler.deleteUser, {
            beforeHandle: apiMiddleware
        })
}
