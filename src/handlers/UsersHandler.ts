import { t } from "elysia";
import { v4 as uuidv4 } from "uuid"
import { usersService } from "../services/UsersService";

export const usersHandler = {
    getUsers: async () => {
        const users = await usersService.getUsers()
        return {
            status: 200,
            data: users
        }
    },

    createUser: async ({ body, set }) => {
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
            status: 200,
            data: user
        };
    },

    deleteUser: async ({ params: { id } }) => {
        await usersService.deleteUser(id)

        return {
            status: 200,
            message: `User ${id} has been successfully deleted!`
        }
    },

    loginUser: async ({ jwt, setCookie, body, set }) => {
        const hashedPassword = await usersService.getPasswordByUsername(body.password)
        const isMatch = await Bun.password.verify(body.password, hashedPassword)

        if (!isMatch) {
            set.status = 401
            return {
                status: 401,
                message: `Password is not correct!`
            }
        }

        const login = await usersService.loginUser({ username: body.username, password: hashedPassword })

        setCookie("auth", await jwt.sign(login), {
            httpOnly: true,
            maxAge: 4 * 86400,
        });

        set.status = 200
        return {
            status: 200,
            message: `Sign in successfully!`
        };
    },

    validateCreateUser: t.Object({
        username: t.String(),
        password: t.String(),
        fullname: t.String(),
        email: t.String(),
    }),
};
