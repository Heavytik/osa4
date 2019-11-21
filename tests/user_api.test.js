
const User = require('../models/user')
const helper = require('./test_helper')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')


const api = supertest(app)

//...

describe('when there is initially one user at db', () => {
    beforeEach(async () => {
        await User.deleteMany({})
        const user = new User({ username: 'root', password: 'sekret' })
        await user.save()
    })

    test('creation succeeds with a fresh username', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'jtoff',
            name: 'J Toff',
            password: 'salainen',
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd.length).toBe(usersAtStart.length + 1)

        const usernames = usersAtEnd.map(u => u.username)
        expect(usernames).toContain(newUser.username)
    })

    test('creation fails with proper statuscode and message if username already taken', async () => {
        //const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'root',
            name: 'Superuser',
            password: 'salainen',
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(result.body.error).toContain('`username` to be unique')

        //const usersAtEnd = await helper.usersInDb()
        //expect(usersAtEnd.length).toBe(usersAtStart.length)
    })

    test('good response to short password or username', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser1 = {
            username: 'ro',
            name: 'Superuser',
            password: 'salainen',
        }

        const newUser2 = {
            username: 'root',
            name: 'Superuser',
            password: 'sa',
        }

        const result1 = await api
            .post('/api/users')
            .send(newUser1)
            .expect(400)

        const result2 = await api
            .post('/api/users')
            .send(newUser2)
            .expect(400)

        expect(result1.body.error).toContain('Password or username too short')
        expect(result2.body.error).toContain('Password or username too short')

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd.length).toBe(usersAtStart.length)
    })
})