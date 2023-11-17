import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from "bun:test";
import { app } from "../src"
import { authentications } from "../helpers/AuthenticationsHelper";
import { users } from "../helpers/UsersHelper";

const url = "http://localhost:3000/api/v1/authentications"
let hashedPassword = await Bun.password.hash('dicoding', {
    algorithm: 'bcrypt',
    cost: parseInt(process.env.BUN_COST)
});

describe('Authentications Endpoint', () => {
    beforeAll(async () => {
        await users.addUser({ password: hashedPassword })
    })
    afterAll(async () => {
        await users.cleanTable()
    })
    describe('POST /', () => {
        afterEach(async () => {
            await authentications.cleanTable()
        })

        it('Should have access token and refresh token', async () => {
            const postPayload = {
                username: 'dicoding',
            }

            const req = await app.fetch(new Request(`${url}`, {
                method: 'POST',
                body: JSON.stringify(postPayload),
                headers: {
                    'Content-Type': 'application/json'
                }
            }))

            const responseBody = await req.json()

            expect(req.status).toEqual(201)
            expect(responseBody.data).toHaveProperty('access_token')
            expect(responseBody.data).toHaveProperty('refresh_token')
        })
    })

    describe('POST /login', () => {
        afterEach(async () => {
            await authentications.cleanTable()
        })

        it('should return status success', async () => {
            const loginPayload = {
                username: 'dicoding',
                password: 'dicoding'
            }

            const req = await app.fetch(new Request(`${url}/login`, {
                method: 'POST',
                body: JSON.stringify(loginPayload),
                headers: {
                    'Content-Type': 'application/json'
                }
            }))

            const responseBody = await req.json()

            expect(req.status).toEqual(200)
            expect(responseBody.status).toEqual('success')
        })
    })
})