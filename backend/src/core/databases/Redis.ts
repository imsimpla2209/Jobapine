/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-useless-constructor */
/* eslint-disable @typescript-eslint/no-var-requires */
import redis from 'predis'
import env from '../libs/Env'

const REDIS_PORT = Number(env('REDIS_PORT', 6379))
const REDIS_HOST = env('REDIS_HOST', '127.0.0.1')
const REDIS_USERNAME = env('REDIS_USERNAME', '')
const REDIS_PASSWORD = env('REDIS_PASSWORD', '')
const TTL = Number(env('REDIS_TTL', 3600))
export default class Redis {
  protected client: any

  constructor() {}

  public async getConnection(): Promise<void> {
    this.client = redis.createClient({
      port: REDIS_PORT,
      server: REDIS_HOST,
      password: REDIS_PASSWORD,
      username: REDIS_USERNAME,
      lazyConnect: true,
      connectTimeout: 1000,
      maxRetriesPerRequest: 1,
      retry_strategy(options: any) {
        if (options.error && options.error.code === 'ECONNREFUSED') {
          // End reconnecting on a specific error and flush all commands with
          // a individual error
          return new Error('The server refused the connection')
        }
        if (options.total_retry_time > 1000 * 60 * 60) {
          // End reconnecting after a specific timeout and flush all commands
          // with a individual error
          return new Error('Retry time exhausted')
        }
        if (options.attempt > 10) {
          // End reconnecting with built in error
          return undefined
        }
        // reconnect after
        return Math.min(options.attempt * 100, 3000)
      },
    })
    return this.client
  }

  public async get(keys: string): Promise<any> {
    return this.client.get(keys)
  }

  public async setex(keys: any, data: any, ttl = TTL): Promise<any> {
    return this.client.setex(keys, ttl, data)
  }

  public async closeConnection(): Promise<void> {
    return this.client.quit()
  }
}
