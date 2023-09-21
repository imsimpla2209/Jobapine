import { Container } from 'inversify'
import { SocketIO } from '@core/libs/SocketIO'
import Redis from '@core/databases/Redis'
import TYPES from './types'

const container = new Container()

container.bind(TYPES.SocketIO).to(SocketIO).inSingletonScope()
container.bind(TYPES.Redis).to(Redis).inSingletonScope()

export default container
