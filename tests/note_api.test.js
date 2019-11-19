
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')

const api = supertest(app)

const blogs = [
    {
        title: 'React patterns',
        author: 'Michael Chan',
        url: 'https://reactpatterns.com/',
        likes: 7,
    },
    {
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
    },
    {
        title: 'Canonical string reduction',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
        likes: 12,
    },
    {
        title: 'First class tests',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
        likes: 10,
    },
    {
        title: 'TDD harms architecture',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
        likes: 0,
    },
    {
        title: 'Type wars',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
        likes: 2,
    }
]

beforeEach(async () => {
    await Blog.deleteMany({})

    blogs.forEach(async (blog) => {
        let blogObject = new Blog(blog)
        await blogObject.save()
    })
})

test('Blog info is returned as json', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

test('right amount of notes returned', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body.length).toBe(blogs.length)
})

test('blog identifiers should be tagged as id', async () => {
    const response = await api.get('/api/blogs')

    console.log(response.body[0])

    expect(response.body[0].id).toBeDefined()
})

test('post a blog to server', async () => {
    const newBlog = {
        title: 'Uus juttu',
        author: 'joku',
        url: 'yle.fi',
        likes: 5,
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-type', /application\/json/)

    const response = await api.get('/api/blogs')
    const titles = response.body.map(b => b.title)

    expect(response.body.length).toBe(blogs.length + 1)
    expect(titles).toContain('Uus juttu')
})

afterAll(() => {
    mongoose.connection.close()
})