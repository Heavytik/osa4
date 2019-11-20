const blogsRouter = require('express').Router()
const Blog = require('../models/blog')



blogsRouter.get('/', (request, response) => {
  Blog
    .find({})
    .then(blogs => {
      response.json(blogs.map(blog => blog.toJSON()))
    })
})

blogsRouter.post('/', (request, response) => {
  const blog = new Blog({
    title: request.body.title,
    author: request.body.author,
    url: request.body.url,
    likes: request.body.likes || 0
  })

  if (!(blog.title && blog.url)) {
    response
      .status(400)
      .end()
  }

  blog
    .save()
    .then(result => {
      response.status(201).json(result)
    })
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
