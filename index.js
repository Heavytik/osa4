
require('dotenv').config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
const middleware = require('./utils/middleware')
const blogsRouter = require('./controllers/blogs')
const Blog = require('./models/blog')

const PORT = process.env.PORT
const MONGOURL = process.env.MONGODB_URI

mongoose.connect(MONGOURL, { useNewUrlParser: true })

module.exports = Blog

app.use(cors())
app.use(bodyParser.json())
app.use(middleware.logger)

app.use('/api/blogs', blogsRouter)

app.use(middleware.error)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})