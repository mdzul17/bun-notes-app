import { afterAll, beforeAll, describe, expect, it, jest } from "bun:test";
import { app } from "../src/index"
import { PrismaClient } from "@prisma/client";
import { jsonwebtoken as jwt } from "jsonwebtoken";

const db = new PrismaClient();
const url = `http://localhost:3000/api/v1/users`;

describe('Users endpoint', () => {
    describe('GET USERS', () => {
        afterAll(async () => {
            await db.users.deleteMany({})
        })

        it('should return 200 and have 0 array of results', async () => {
            const req = new Request(url, {
                method: 'GET'
            });

            const res = await app.fetch(req);

            const responseBody = await res.json();
            expect(res.status).toEqual(200);
            expect(responseBody).toHaveLength(0);
            expect(responseBody.password).toEqual(undefined)
        })

        it('should return 200 and have 2 array of results', async () => {
            await db.users.createMany({
                data: [
                    { id: 'user-123', email: 'dicoding@dicoding.com', username: 'dicoding', password: 'password123', fullname: 'Dicoding Indonesia' },
                    { id: 'user-124', email: 'dicoding2@dicoding.com', username: 'dicoding2', password: 'password123', fullname: 'Dicoding2 Indonesia' }
                ]
            })

            const req = new Request(url, {
                method: 'GET'
            });

            const res = await app.fetch(req);

            const responseBody = await res.json();
            expect(res.status).toEqual(200);
            expect(responseBody).toHaveLength(2);
            expect(responseBody[0].password).toEqual(undefined);
            expect(responseBody[1].password).toEqual(undefined);
        })
    })

    describe('POST USERS', () => {
        afterAll(async () => {
            await db.users.deleteMany({})
        })

        it('should return 201 and have 0 array of results', async () => {
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
            console.log(res)

            expect(res.status).toEqual(400);
        })
    })

    describe('GET USER BY ID', () => {
        afterAll(async () => {
            await db.users.deleteMany({})
        })

        beforeAll(async () => {
            await db.users.create({ data: { id: 'user-123', email: 'dicoding@dicoding.com', username: 'dicoding', password: 'password123', fullname: 'Dicoding Indonesia' } })
        })

        it('should respond 201 status code and an object users', async () => {
            const secret_key = process.env.JWT_SECRET
            const token = jwt.sign({ id: 'user-123' }, secret_key);

            const req = new Request(`${url}/user-123`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        })
    })
})