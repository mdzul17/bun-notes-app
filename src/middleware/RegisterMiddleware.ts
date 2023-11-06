export const registerMiddleware = async ({ body: { email } }) => {
    const re = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/

    if (!email.match(re)) {
        return {
            status: 400,
            message: `Email format is not correct!`
        }
    }
}