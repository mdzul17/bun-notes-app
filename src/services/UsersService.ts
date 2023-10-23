import { NotFoundError } from "elysia";
import { PrismaClient } from "@prisma/client";
import { InvariantError } from "../exceptions/InvariantError";

const db = new PrismaClient();

export const usersService = {
    getUsers: async () => {
        return await db.users.findMany();
    },

    createUser: async (payload: any) => {
        const user = await db.users.create({
            data: {
                id: payload.id,
                username: payload.username,
                fullname: payload.fullname,
                email: payload.email,
                password: payload.password,
            },
        });

        if (!user) throw new InvariantError("User failed to be added")
        return user;
    },

    getUserById: async (id: string) => {
        const user = await db.users.findFirst({
            where: {
                id: {
                    equals: id,
                },
            },
        });

        if (!user) throw new NotFoundError("User not found");
        return user;
    },

    deleteUser: async (id: string) => {
        await db.users.delete({
            where: {
                id: id,
            },
        });
    },

    loginUser: async (username: string, password: string) => {
        const user = await db.users.findFirst({
            where: {
                username: {
                    equals: username,
                },
                password: {
                    equals: password
                }
            },
            select: {
                id: true
            }
        })


        if (!user) throw new InvariantError("Username or password is wrong!")
    },

    verifyUserByUsername: async (username: string) => {
        const user = await db.users.findFirst({
            where: {
                username: {
                    equals: username,
                },
            },
            select: {
                id: true,
            },
        });

        return user;
    },
};
