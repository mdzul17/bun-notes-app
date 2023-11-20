import { beforeEach, describe, expect, it } from "bun:test";
import { app } from "../src/index"
import { usersTableTestHelper } from "../helpers/UsersHelper";
import { authenticationsTableTestHelper } from "../helpers/AuthenticationsHelper";

const url = `http://localhost:3000/api/v1/users`;

describe('Users endpoint', () => {
    describe('GET /usersTableTestHelper', () => {
        beforeEach(async () => {
            await usersTableTestHelper.cleanTable()
        })

        it('should return 200 and have 0 array of results', async () => {
            const req = new Request(url, {
                method: 'GET'
            });

            const res = await app.fetch(req);

            const responseBody = await res.json();
            expect(res.status).toEqual(200);
            expect(responseBody.data).toHaveLength(0);
        })

        it('should return 200 and have 2 array of results', async () => {
            await usersTableTestHelper.addUser({ id: `user-123`, username: 'dicoding', email: 'dicoding@dicoding.com', fullname: 'dicoding', password: 'dicoding123' })
            await usersTableTestHelper.addUser({ id: `user-124`, username: 'bayu', email: 'dicoding@dicoding.com', fullname: 'bayu', password: 'dicoding123' })

            const req = new Request(url, {
                method: 'GET'
            });

            const res = await app.fetch(req);

            const responseBody = await res.json();
            expect(res.status).toEqual(200);
            expect(responseBody.data).toHaveLength(2);
            expect(responseBody.data[0].password).toEqual(undefined);
            expect(responseBody.data[1].password).toEqual(undefined);
        })
    })

    describe('POST /usersTableTestHelper', () => {
        beforeEach(async () => {
            await usersTableTestHelper.cleanTable()
        })

        it('should return 201', async () => {
            const payload = {
                fullname: 'Dicoding Indonesia',
                username: 'dicoding',
                password: 'dicoding-123',
                email: 'dicoding@dicoding.com'
            }

            const req = new Request(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            const res = await app.fetch(req);
            const responseBody = await res.json();

            expect(res.status).toEqual(201);
            expect(responseBody.message).toEqual(`Data ${payload.username} successfully created!`)
        })
        it('should return 400 error code', async () => {
            const payload = {
                fullname: 'Dicoding Indonesia',
                username: 'dicoding',
                password: 'dicoding-123',
            }

            const req = new Request(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            const res = await app.fetch(req);

            expect(res.status).toEqual(400);
        })
    })

    describe('GET /usersTableTestHelper/{id}', () => {
        beforeEach(async () => {
            await usersTableTestHelper.cleanTable()
            await authenticationsTableTestHelper.cleanTable()
            await usersTableTestHelper.addUser({ id: 'user-123', email: 'dicoding@dicoding.com', username: 'dicoding', password: 'password123', fullname: 'Dicoding Indonesia' })
        })

        it('should respond 201 status code and an object usersTableTestHelper', async () => {
            const payload = {
                username: 'dicoding',
                password: 'password123'
            }

            const token = await app.fetch(new Request(`http://localhost:3000/api/v1/authenticationsTableTestHelper/`, {
                method: 'POST',
                body: JSON.stringify(payload),
                headers: {
                    'Content-Type': 'application/json'
                }
            }))

            const userToken = await token.json();

            const req = await app.fetch(new Request(`${url}/user-123`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${userToken.data.access_token}`
                },
            }))

            const responseBody = await req.json()

            expect(responseBody.status).toEqual('success')
        })
    })

    describe('DELETE /usersTableTestHelper/{id}', () => {
        beforeEach(async () => {
            await usersTableTestHelper.cleanTable()
            await authenticationsTableTestHelper.cleanTable()
            await usersTableTestHelper.addUser({})
        })

        it('should return status success', async () => {
            const loginPayload = {
                username: 'dicoding',
                password: 'dicoding'
            }
            const token = await app.fetch(new Request('https://localhost:3000/api/v1/authenticationsTableTestHelper', {
                method: 'POST',
                body: JSON.stringify(loginPayload),
                headers: {
                    'Content-Type': 'application/json'
                }
            }))

            const userToken = await token.json()

            const req = await app.fetch(new Request(`${url}/user-123`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${userToken.data.access_token}`
                }
            }))

            const responseBody = await req.json()

            expect(req.status).toEqual(200)
            expect(responseBody.status).toEqual('success')
        })
    })
})