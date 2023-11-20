import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from "bun:test";
import { app } from "../src"
import { authenticationsTableTestHelper } from "../helpers/AuthenticationsHelper";
import { usersTableTestHelper } from "../helpers/UsersHelper";

const url = "http://localhost:3000/api/v1/authentications"
let hashedPassword = await Bun.password.hash('dicoding', {
    algorithm: 'bcrypt',
    cost: parseInt(process.env.BUN_COST)
});

describe('Authentications Endpoint', () => {
    beforeAll(async () => {
        await usersTableTestHelper.addUser({ password: hashedPassword })
    })
    afterAll(async () => {
        await usersTableTestHelper.cleanTable()
    })
    describe('POST /', () => {
        afterEach(async () => {
            await authenticationsTableTestHelper.cleanTable()
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
            await authenticationsTableTestHelper.cleanTable()
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

    describe('POST /register', () => {
        afterEach(async () => {
            await authenticationsTableTestHelper.cleanTable()
        })

        it('should return status success', async () => {
            const loginPayload = {
                fullname: 'Dicoding Indonesia',
                username: 'admin',
                password: 'admin-123',
                email: 'admin@dicoding.com'
            }

            const req = await app.fetch(new Request(`${url}/register`, {
                method: 'POST',
                body: JSON.stringify(loginPayload),
                headers: {
                    'Content-Type': 'application/json'
                }
            }))

            const responseBody = await req.json()

            expect(req.status).toEqual(201)
            expect(responseBody.status).toEqual('success')
            expect(responseBody.message).toEqual('Register is successfull. Email verification has been sent to your email!')
        })
    })

    describe('PUT /', () => {
        afterEach(async () => {
            await authenticationsTableTestHelper.cleanTable()
            await usersTableTestHelper.cleanTable()
        })

        it('should return new access token', async () => {
            const postPayload = {
                username: 'dicoding',
            }

            const reqToken = await app.fetch(new Request(`${url}`, {
                method: 'POST',
                body: JSON.stringify(postPayload),
                headers: {
                    'Content-Type': 'application/json'
                }
            }))

            const { refresh_token } = await reqToken.json()

            const updateToken = await app.fetch(new Request(`${url}/`, {
                method: 'PUT',
                body: JSON.stringify({ refresh_token }),
                headers: {
                    'Content-Type': 'application/json'
                }
            }))

            const res = await updateToken.json()

            expect(updateToken.status).toEqual(200)
            expect(res.status).toEqual('success')
            expect(res.message).toEqual("Access token successfully updated")
            expect(res.data).toHaveProperty('access_token')
        })
    })
})