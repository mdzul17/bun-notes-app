import { usersHandler } from "../handlers/UsersHandler";

export function configureUsersRoutes(app) {
    return app
        .get("/", usersHandler.getUsers)
        .guard({ body: usersHandler.validateCreateUser }, (guardApp) =>
            guardApp
                .post("/", usersHandler.createUser)
        )
        .get("/:id", usersHandler.getUserById)
        .delete("/:id", usersHandler.deleteUser)
        .post("/login", usersHandler.loginUser)
}
