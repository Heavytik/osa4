const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }
  return null
}

blogsRouter.get('/', (request, response) => {
  Blog
    .find({})
    .populate('user')
    .then(blogs => {
      response.json(blogs.map(blog => blog.toJSON()))
    })
})

blogsRouter.post('/', async (request, response, next) => {

  const token = getTokenFrom(request)
  const users = await User.find({})

  try {
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (!token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    const user = await User.findById(decodedToken.id)

    const blog = new Blog({
      title: request.body.title,
      author: request.body.author,
      url: request.body.url,
      likes: request.body.likes || 0,
      user: user._id
    })

    if (!(blog.title && blog.url)) {
      response
        .status(400)
        .end()
    }

    const savedBlog = await blog.save()

    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.status(201).json(savedBlog)

  } catch (exception) {
    next(exception)
  }

})

blogsRouter.delete('/:id', (request, response) => {

  Blog
    .deleteOne({ _id: request.params.id }, (err) => {
      console.log("Error: ", err)
    })
    .then(() => {
      response.end()
    })

})

blogsRouter.patch('/:id', (request, response) => {

  const newTitle = {
    title: request.body.title
  }

  Blog.findByIdAndUpdate(request.params.id, newTitle, { new: true }).then(
    response.end()
  )

})

module.exports = blogsRouter
