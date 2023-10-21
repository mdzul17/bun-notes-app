import { usersController } from "../controllers/UsersController";

export function configureUsersRoutes(app) {
    return app
        .get("/", usersController.getUsers)
        .guard({ body: usersController.validateCreateUser }, (guardApp) =>
            guardApp
                .post("/", usersController.createUser)
        )
        .get("/:id", usersController.getUserById)
        .delete("/:id", usersController.deleteUser)
        .post("/login", usersController.loginUser)
}
