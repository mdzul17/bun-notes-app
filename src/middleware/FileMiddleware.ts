import { InvariantError } from "../exceptions/InvariantError"

export const fileMiddleware = async ({ body: { cover } }) => {
    if (cover.size < 5000) throw new InvariantError("File too small!")
    if (cover.size > 500000) throw new InvariantError("File too large!")
}