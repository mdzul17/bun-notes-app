import { t } from "elysia";
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid"

const db = new PrismaClient();

export const usersController = {
    getUsers: async ({ query, cookie }) => {
        return db.users.findMany({
            where: {
                id: {
                    equals: query.id
                }
            }
        });
    },

    createUser: async ({ body, set, cookie }) => {
        const id = uuidv4();
        await db.users.create({
            data: {
                id: `users-${id}`,
                username: body.username,
                fullname: body.fullname,
                email: body.email,
                password: body.password,
            }
        });
        set.status = 201;
        return `Data ${body.username} successfully created!`;
    },

    getUserById: async ({ set, params: { id }, cookie }) => {
        const user = await db.users.findFirst({
            where: {
                id: {
                    equals: id
                }
            }
        })

        if (!user) {
            set.status = 404;
            return `User tidak tersedia!`
        }

        set.status = 200;
        return user
    },

    deleteUser: async ({ set, params: { id }, cookie }) => {
        try {
            await db.users.delete({
                where: {
                    id: id
                }
            })
            return `User deleted successfully!`
        } catch (error) {
            set.status = 404
            return `User not found!`
        }
    },

    verifyUserByUsername: async (username: string) => {
        const user = await db.users.findFirst({
            where: {
                username: {
                    equals: username
                }
            }
        })

        return user.id
    },

    validateCreateUser: t.Object({
        username: t.String(),
        password: t.String(),
        fullname: t.String(),
        email: t.String()
    })
};
