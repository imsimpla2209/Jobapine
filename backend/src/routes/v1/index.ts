import express, { Router } from 'express'
import config from '@config/config'
import authRoute from './auth.route'
import docsRoute from './swagger.route'
import userRoute from './user.route'
import jobRoute from './job.route'
import freelancerRoute from './freelancer.route'
import clientRoute from './client.route'
import proposalRoute from './proposal.route'
import contractRoute from './contract.route'
import paymentRoute from './payment.route'
import messageRoute from './message.route'
import notifyRoute from './notify.route'

const router = express.Router()

interface IRoute {
  path: string
  route: Router
}

const defaultIRoute: IRoute[] = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/clients',
    route: clientRoute,
  },
  {
    path: '/jobs',
    route: jobRoute,
  },
  {
    path: '/freelancers',
    route: freelancerRoute,
  },
  {
    path: '/proposals',
    route: proposalRoute,
  },
  {
    path: '/contracts',
    route: contractRoute,
  },
  {
    path: '/payments',
    route: paymentRoute,
  },
  {
    path: '/notify',
    route: notifyRoute,
  },
  {
    path: '/messages',
    route: messageRoute,
  },
]

const devIRoute: IRoute[] = [
  // IRoute available only in development mode
  {
    path: '/docs',
    route: docsRoute,
  },
]

defaultIRoute.forEach(route => {
  router.use(route.path, route.route)
})

/* istanbul ignore next */
if (config.env === 'development') {
  devIRoute.forEach(route => {
    router.use(route.path, route.route)
  })
}

export default router
