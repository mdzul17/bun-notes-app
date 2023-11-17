import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

export const users = {
    addUser: async ({
        id = `user-123`,
        username = 'dicoding',
        password = 'dicoding',
        fullname = 'Dicoding Indonesia',
        email = 'dicoding@dicoding.com'
    }) => {
        await db.users.create({
            data: {
                id: id,
                username: username,
                password: password,
                fullname: fullname,
                email: email
            }
        })
    },
    cleanTable: async () => {
        await db.users.deleteMany({})
    },
    getUserById: async ({
        id = `user-123`,
        username = 'dicoding',
        password = 'dicoding',
        fullname = 'Dicoding Indonesia',
        email = 'dicoding@dicoding.com'
    }) => {
        await db.users.update({
            where: {
                id: id
            },
            data: {
                username: username,
                password: password,
                fullname: fullname,
                email: email
            }
        })
    }
}