import { t } from "elysia";
import { v4 as uuidv4 } from "uuid"
import { usersService } from "../services/UsersService";

export const usersHandler = {
    getUsers: async () => {
        const users = await usersService.getUsers()
        return {
            status: "success",
            data: users
        }
    },

    createUser: async ({ body, set }) => {
        await usersService.verifyUsernameIsAvailable(body.username);

        const id = uuidv4();
        const passwordHash = await Bun.password.hash(body.password, {
            algorithm: 'bcrypt',
            cost: parseInt(process.env.BUN_COST)
        })


        await usersService.createUser(
            {
                id: `users-${id}`,
                ...body,
                password: passwordHash
            },
        );

        set.status = 201;
        return { message: `Data ${body.username} successfully created!` };
    },

    getUserById: async ({ set, params: { id } }) => {
        const user = await usersService.getUserById(id)

        set.status = 200
        return {
            status: "success",
            data: user
        };
    },

    deleteUser: async ({ params: { id } }) => {
        await usersService.deleteUser(id)

        return {
            status: "success",
            message: `User ${id} has been successfully deleted!`
        }
    },

    validateCreateUser: t.Object({
        username: t.String(),
        password: t.String(),
        fullname: t.String(),
        email: t.String(),
    }),
};
