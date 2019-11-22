const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')



blogsRouter.get('/', (request, response) => {
  Blog
    .find({})
    .populate('user')
    .then(blogs => {
      response.json(blogs.map(blog => blog.toJSON()))
    })
})

blogsRouter.post('/', async (request, response) => {

  const users = await User.find({})

  const firstUser = users[0]

  const blog = new Blog({
    title: request.body.title,
    author: request.body.author,
    url: request.body.url,
    likes: request.body.likes || 0,
    user: firstUser._id
  })



  if (!(blog.title && blog.url)) {
    response
      .status(400)
      .end()
  }



  const savedBlog = await blog.save()
  // .then(result => {
  //   response.status(201).json(result)
  // })

  firstUser.blogs = firstUser.blogs.concat(savedBlog._id)
  await firstUser.save()

  response.status(201).json(savedBlog)

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
