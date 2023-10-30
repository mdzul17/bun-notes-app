import { usersService } from "../services/UsersService"

export const collaborationMiddleware = async ({ jwt, bearer, set }) => {
    if (!bearer) {
        set.status = 400
        set.headers[
            'WWW-Authenticate'
        ] = `Bearer realm='sign', error="invalid_request"`

        return 'Unauthorized'
    }

    const userId = jwt.verify(bearer);
    await usersService.verifyUserById(userId);
}