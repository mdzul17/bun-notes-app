import { NotFoundError } from "elysia";
import { PrismaClient } from "@prisma/client";
import { InvariantError } from "../exceptions/InvariantError";
import { AuthorizationError } from "../exceptions/AuthorizationError";
import { AuthenticationError } from "../exceptions/AuthenticationError";

const db = new PrismaClient();

interface createUserPayload {
    id: string,
    username: string,
    fullname: string,
    email: string,
    password: string
}

interface loginPayload {
    username: string,
    password: string
}

export const usersService = {
    getUsers: async () => {
        return await db.users.findMany({
            select: {
                id: true,
                username: true,
                fullname: true,
                email: true,
            }
        });
    },

    createUser: async (payload: createUserPayload) => {
        const user = await db.users.create({
            data: {
                id: payload.id,
                username: payload.username,
                fullname: payload.fullname,
                email: payload.email,
                password: payload.password,
            },
            select: {
                id: true
            }
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
            select: {
                id: true,
                username: true,
                fullname: true,
                email: true,
            }
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

    getPasswordByUsername: async (username: string) => {
        const getPassword = await db.users.findFirst({
            where: {
                username: {
                    equals: username
                }
            },
            select: {
                password: true
            }
        })

        if (!getPassword) throw new InvariantError("Username is not found!")

        return getPassword.password
    },

    loginUser: async (body: loginPayload) => {
        const user = await db.users.findFirst({
            where: {
                username: {
                    equals: body.username,
                },
                password: {
                    equals: body.password
                }
            },
            select: {
                id: true
            }
        })


        if (!user) throw new AuthenticationError("Username or password is wrong!")
        return user
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

        if (!user) throw new AuthenticationError("Username or password is wrong!")

        return user;
    },

    verifyUserById: async (id: string) => {
        const user = await db.users.findFirst({
            where: {
                username: {
                    equals: id,
                },
            },
        });

        if (!user) throw new AuthorizationError("You have no access!")
    },

    verifyUsernameIsAvailable: async (username: string) => {
        const isAvailable = await db.users.findFirst({
            where: {
                username: {
                    equals: username
                }
            },
        })

        if (isAvailable) throw new InvariantError('Username already exist!')
    },

    verifyEmailAvailability: async (email: string) => {
        const isAvailable = await db.users.findFirst({
            where: {
                email: {
                    equals: email
                }
            },
            select: {
                email: true
            }
        })

        if (!isAvailable) throw new InvariantError('Email has already been used')
    }
};
