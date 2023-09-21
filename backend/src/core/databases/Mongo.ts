import mongoose from 'mongoose'
import config from '@config/config'
import logger from 'common/logger/logger'

const initiateMongoServer = async (): Promise<void> => {
  mongoose
    .connect(config.mongoose.url, { maxPoolSize: 50 })
    .then(() => {
      logger.info('Connected to MongoDB')
    })
    .catch(err => {
      logger.error(`Cannot connect to DB!!, log:`, err)
      throw err
    })
}
export default initiateMongoServer
