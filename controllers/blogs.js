const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', (request, response) => {
  Blog
    .find({})
    .populate('user')
    .then(blogs => {
      response.json(blogs.map(blog => blog.toJSON()))
    })
})

blogsRouter.post('/', async (request, response, next) => {

  try {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!request.token || !decodedToken.id) {
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

blogsRouter.delete('/:id', async (request, response, next) => {

  //TODO: Set token with DELETE request (without body)

  /*
  try {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!request.token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    const user = await User.findById(decodedToken.id)

    if (user._id === request.params.id) {*/
  await Blog
    .deleteOne({ _id: request.params.id }, (err) => {
      console.log("Error: ", err)
    })
  response.end()
  /*
} else {
  response.status('401').json({
    error: 'you have no rights to delete this blog'
  })
}

} catch (exception) {
next(exception)
}*/

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
