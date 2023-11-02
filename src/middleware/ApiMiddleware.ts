export const apiMiddleware = async ({ bearer, set, cookie: { auth }, jwt }) => {
    if (!bearer || !auth) {
        set.status = 401
        set.headers[
            'WWW-Authenticate'
        ] = `Bearer realm='sign', error="invalid_request"`

        return {
            status: 401,
            message: 'Unauthorized'
        }
    }

    const profile = await jwt.verify(auth);
    if (!profile) {
        set.status = 401
        set.headers[
            'WWW-Authenticate'
        ] = `Bearer realm='sign', error="invalid_request"`

        return {
            status: 401,
            message: 'Unauthorized'
        }
    }
}