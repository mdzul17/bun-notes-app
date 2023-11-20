import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { notesTableTestHelper } from "../helpers/NotesHelper";
import { usersTableTestHelper } from "../helpers/UsersHelper";
import { app } from "../src";
import { authenticationsTableTestHelper } from "../helpers/AuthenticationsHelper";
import { activitiesTableTestHelper } from "../helpers/ActivitiesTableTestHelper";

const url = "http://localhost:3000/api/v1/notes"

describe('Notes endpoint', () => {
    describe('GET /', () => {
        beforeEach(async () => {
            await usersTableTestHelper.addUser({})
        })
        afterEach(async () => {
            await activitiesTableTestHelper.cleanTable()
            await notesTableTestHelper.cleanTable()
            await usersTableTestHelper.cleanTable()
            await authenticationsTableTestHelper.cleanTable()
        })

        it('should return success and 0 length', async () => {
            const getToken = await app.fetch(new Request(`http://localhost:3000/api/v1/authentications/`, {
                method: 'POST',
                body: JSON.stringify({ username: 'dicoding' }),
                headers: {
                    'Content-Type': 'application/json'
                }
            }))

            const resToken = await getToken.json()
            const { access_token } = resToken.data

            const getNotes = await app.fetch(new Request(`${url}/`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            }))

            const resNotes = await getNotes.json();

            expect(getNotes.status).toEqual(200)
            expect(resNotes.status).toEqual('success')
            expect(resNotes.data).toHaveLength(0)
        })

        it('should return success and 1 length', async () => {
            await notesTableTestHelper.addNotes({})

            const getToken = await app.fetch(new Request(`http://localhost:3000/api/v1/authentications/`, {
                method: 'POST',
                body: JSON.stringify({ username: 'dicoding' }),
                headers: {
                    'Content-Type': 'application/json'
                }
            }))

            const resToken = await getToken.json()
            const { access_token } = resToken.data

            const getNotes = await app.fetch(new Request(`${url}/`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            }))

            const resNotes = await getNotes.json();

            expect(getNotes.status).toEqual(200)
            expect(resNotes.status).toEqual('success')
            expect(resNotes.data).toHaveLength(1)
        })
    })
    describe('POST /', () => {
        beforeEach(async () => {
            await usersTableTestHelper.addUser({})
        })
        afterEach(async () => {
            await activitiesTableTestHelper.cleanTable()
            await notesTableTestHelper.cleanTable()
            await usersTableTestHelper.cleanTable()
            await authenticationsTableTestHelper.cleanTable()
        })
        it('Should return status success and note id', async () => {
            const getToken = await app.fetch(new Request(`http://localhost:3000/api/v1/authentications/`, {
                method: 'POST',
                body: JSON.stringify({ username: 'dicoding' }),
                headers: {
                    'Content-Type': 'application/json'
                }
            }))

            const resToken = await getToken.json()
            const { access_token } = resToken.data

            const notePayload = {
                title: 'dicoding note',
                body: 'dicoding note',
            }

            const req = await app.fetch(new Request(`${url}/`, {
                method: 'POST',
                body: JSON.stringify(notePayload),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${access_token}`
                }
            }))

            const responseBody = await req.json()

            expect(req.status).toEqual(201)
            expect(responseBody.status).toEqual('success')
            expect(responseBody.data).toHaveProperty('id')
        })
    })
    describe('GET /{id}', () => {
        beforeEach(async () => {
            await usersTableTestHelper.addUser({})
        })
        afterEach(async () => {
            await activitiesTableTestHelper.cleanTable()
            await notesTableTestHelper.cleanTable()
            await usersTableTestHelper.cleanTable()
            await authenticationsTableTestHelper.cleanTable()
        })
        it('Should return status success and note data', async () => {
            const getToken = await app.fetch(new Request(`http://localhost:3000/api/v1/authentications/`, {
                method: 'POST',
                body: JSON.stringify({ username: 'dicoding' }),
                headers: {
                    'Content-Type': 'application/json'
                }
            }))

            const resToken = await getToken.json()
            const { access_token } = resToken.data

            const notePayload = {
                title: 'dicoding note',
                body: 'dicoding note',
            }

            const postNote = await app.fetch(new Request(`${url}/`, {
                method: 'POST',
                body: JSON.stringify(notePayload),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${access_token}`
                }
            }))

            const responseBody = await postNote.json()
            const { id: noteId } = responseBody.data

            const req = await app.fetch(new Request(`${url}/${noteId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            }))

            const res = await req.json()

            expect(req.status).toEqual(200)
            expect(res.status).toEqual('success')
            expect(res.data).toHaveProperty('id')
            expect(res.data).toHaveProperty('title')
            expect(res.data).toHaveProperty('body')
        })
    })
})