import mongoose from 'mongoose'
import app from './app'
import config from './config/config'
import logger from './common/logger/logger'
import initiateMongoServer from './core/databases/Mongo'
import { SocketIO } from './core/libs/SocketIO'

let server: any
initiateMongoServer().then(() => {
  server = app.listen(config.port, () => {
    logger.info(`Listening to port ${config.port}`)
    const io = new SocketIO(server)
    app.set('socketio', io)
    logger.info(`Docs available at ${config.apiHost}/docs`)
  })
})

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed')
      process.exit(1)
    })
  } else {
    process.exit(1)
  }
}

const unexpectedErrorHandler = (error: string) => {
  logger.error(error)
  exitHandler()
}

process.on('uncaughtException', unexpectedErrorHandler)
process.on('unhandledRejection', unexpectedErrorHandler)

process.on('SIGINT', () => {
  mongoose.connection.close()
  logger.info('Mongoose disconnected on app termination')
  process.exit(0)
})

process.on('SIGTERM', () => {
  logger.info('SIGTERM received')
  if (server) {
    server.close()
  }
})
