import { t } from "elysia";
import { v4 as uuidv4 } from "uuid"
import { usersService } from "../services/UsersService";

export const usersHandler = {
    getUsers: async ({ bearer }) => {
        console.log(bearer)
        return await usersService.getUsers()
    },

    createUser: async ({ body, set }) => {
        const id = uuidv4();
        await usersService.createUser(
            {
                id: `users-${id}`,
                ...body
            },
        );
        set.status = 201;
        return `Data ${body.username} successfully created!`;
    },

    getUserById: async ({ set, params: { id } }) => {
        const user = await usersService.getUserById(id)

        return user;
    },

    deleteUser: async ({ params: { id } }) => {
        await usersService.deleteUser(id)

        return `User ${id} has been successfully deleted!`
    },

    loginUser: async ({ jwt, cookie: { auth }, setCookie, body }) => {
        const login = await usersService.loginUser(body.username, body.password)

        const profile = await jwt.verify(auth);

        if (!profile) {
            setCookie("auth", await jwt.sign(login), {
                httpOnly: true,
                maxAge: 4 * 86400,
            });
        }

        return `Sign in successfully!`;
    },

    validateCreateUser: t.Object({
        username: t.String(),
        password: t.String(),
        fullname: t.String(),
        email: t.String(),
    }),
};
