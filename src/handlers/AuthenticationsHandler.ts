import { usersService } from "../services/UsersService";
import { authenticationsService } from "../services/AuthenticationsService";

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
};
