const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
const middleware = require('./utils/middleware')
const blogsRouter = require('./controllers/blogs')
const Blog = require('./models/blog')
const config = require('./utils/config')
const logger = require('./utils/logger')

logger.info('connectiong to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true
})
    .then(() => {
        logger.info('connected to MongoDB')
    }).catch((error) => {
        logger.error('error connection to MongoDB:', error.message)
    })

module.exports = Blog

app.use(cors())
app.use(bodyParser.json())
app.use(middleware.requestLogger)

app.use('/api/blogs', blogsRouter)

app.use(middleware.errorHandler)

module.exports = app