
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
const middleware = require('./utils/middleware')
const blogsRouter = require('./controllers/blogs')
const Blog = require('./models/blog')

const mongoUrl = 'mongodb://jere.tofferi:abcabc123123@ds215633.mlab.com:15633/blogilista-jere'
mongoose.connect(mongoUrl, { useNewUrlParser: true })

module.exports = Blog

app.use(cors())
app.use(bodyParser.json())
app.use(middleware.logger)


app.use('/api/blogs', blogsRouter)

app.use(middleware.error)

const PORT = 3003
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})