const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
const middleware = require('./utils/middleware')
const usersRouter = require('./controllers/users')
const blogsRouter = require('./controllers/blogs')
const loginRouter = require('./controllers/login')
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
app.use(middleware.tokenExtractor)

app.use('/api/users', usersRouter)
app.use('/api/blogs', blogsRouter)
app.use('/api/login', loginRouter)

app.use(middleware.errorHandler)

module.exports = app