/* eslint-disable import/no-mutable-exports */
import { Container } from 'inversify'

import libsContainer from './libs'

const container = Container.merge(new Container(), libsContainer)

export default container
