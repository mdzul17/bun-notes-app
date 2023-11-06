import { usersService } from "../services/UsersService";
import { authenticationsService } from "../services/AuthenticationsService";
import { t } from "elysia";
import { uuidv4 } from "uuid"

export const authenticationsHandler = {
    postAuthentications: async ({ jwt, refreshJwt, body, set }) => {
        const userId = await usersService.verifyUserByUsername(body.username);

        const access_token = await jwt.sign(userId);
        const refresh_token = await refreshJwt.sign(userId);

        await authenticationsService.addRefreshToken(refresh_token)

        set.status = 201;

        return {
            data: {
                access_token: access_token,
                refresh_token: refresh_token,
            },
        };
    },
    putAuthentications: async ({
        jwt,
        refreshJwt,
        body: { refresh_token },
        set,
    }) => {
        await authenticationsService.verifyRefreshToken(refresh_token)

        const tokenPayload = await refreshJwt.verify(refresh_token);
        const access_token = await jwt.sign(tokenPayload);

        set.status = 200;
        return {
            message: "Access token successfully updated",
            data: {
                access_token: access_token,
            },
        };
    },
    deleteAuthentications: async ({
        refreshJwt,
        body: { refresh_token },
        set,
    }) => {
        await authenticationsService.verifyRefreshToken(refresh_token)

        await refreshJwt.verify(refresh_token);

        set.status = 200;
        return {
            message: "Refresh token has been successfully deleted",
        };
    },

    loginUser: async ({ jwt, setCookie, body, set }) => {
        const hashedPassword = await usersService.getPasswordByUsername(body.username)
        const isMatch = await Bun.password.verify(body.password, hashedPassword)

        if (!isMatch) {
            set.status = 401
            return {
                status: "failed",
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
            status: "success",
            message: `Sign in successfully!`
        };
    },

    registerUser: async ({ body }) => {
        await usersService.verifyUsernameIsAvailable(body.username);
        await usersService.verifyEmailAvailability(body.email)

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
    },

    registerPayload: t.Object({
        fullname: t.String(),
        username: t.String(),
        password: t.String(),
        email: t.String()
    })
};
