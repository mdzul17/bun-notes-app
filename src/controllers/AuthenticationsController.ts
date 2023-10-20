import { PrismaClient } from "@prisma/client";
import { usersController } from "./UsersController";

export const authenticationsController = {
    postAuthentications: async ({ jwt, cookie, setCookie, body, set }) => {
        const isAvailable = await usersController.verifyUserByUsername(body.username);

        if (!isAvailable) {
            set.status = 404
            return `Username is wrong`
        }

        setCookie('auth', await jwt.sign(body), {
            httpOnly: true,
            maxAge: 4 * 86400
        })

        console.log('eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Im1kenVsIiwicGFzc3dvcmQiOiIxMjM0NTYiLCJleHAiOjE2OTgzOTk4Njl9.yDtm0w2AtrYvODBQUtZX96YjikbkgdMOAYA2YkBQcdM')

        return `Sign in as ${cookie.auth}`;
    },
};
