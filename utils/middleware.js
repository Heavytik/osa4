
const logger = require('./logger')

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---')
  next()
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  response.status(404).send({ error: 'unknown endpoint' })

  next(error)
}

module.exports = {
  requestLogger,
  errorHandler
}