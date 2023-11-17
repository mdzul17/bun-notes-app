export const apiMiddleware = async ({ bearer, set, cookie: { auth }, jwt }) => {
    if (!bearer && !auth) {
        set.status = 401
        set.headers[
            'WWW-Authenticate'
        ] = `Bearer realm='sign', error="invalid_request"`

        return {
            status: "error",
            message: 'Unauthorized'
        }
    }

    const profile = auth ? await jwt.verify(auth) : await jwt.verify(bearer);
    if (!profile) {
        set.status = 401
        set.headers[
            'WWW-Authenticate'
        ] = `Bearer realm='sign', error="invalid_request"`

        return {
            status: "error",
            message: 'Unauthorized'
        }
    }
}