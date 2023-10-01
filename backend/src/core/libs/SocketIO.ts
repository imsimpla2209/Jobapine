/* eslint-disable import/no-mutable-exports */
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as socketio from 'socket.io'
import logger from 'common/logger/logger'

export interface SocketIOData {
  socketio: SocketIO
  socket: socketio.Socket
}

export class SocketIO {
  private io: socketio.Socket

  clients: any = {}

  constructor(server: Express.Application) {
    logger.info('Socket.io', 'Started')
    // eslint-disable-next-line @typescript-eslint/no-var-requires, global-require
    this.io = require('socket.io')(server, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
      },
    })
    this.init()
  }

  private async init() {
    this.io.on('connect', async (socket: socketio.Socket) => {
      logger.warning('NEW CONNECTION', socket.id)
      this.clients[socket.id] = socket
      /**
       * OPTIONAL NOTE:
       * BROADCAST IF NEW CONNECTION HAS BEEN RECEIVED
       */
      this.broadcastAll('new_connection', { socket_id: socket.id })

      /**
       * BROADCAST IF SOMEONE GOT DISCONNECTED EXCEPT SENDER
       */
      socket.on('disconnect', () => {
        logger.error('SOCKET DISCONNECTED', socket.id)

        /** OPTIONAL NOTE: Implement disconnect event on client side */
        // socket.broadcast.emit('disconnect_connection', socket.id)

        delete this.clients[socket.id]
      })
    })
  }

  /** Use io.emit to broadcast event to all connected clients */
  broadcastAll(event: string, payload: unknown): void {
    // logger.info('BROADCASTING', `Clients: ${Object.keys(this.clients).length}`)
    this.io.emit(event, payload)
  }

  /** SEND TO SPECIFIC ID */
  sendToId(socket_id: string, event: string, payload: unknown): void {
    logger.info('SENDING TO SPECIFIC ID:', socket_id)
    this.io.to(socket_id).emit(event, payload)
  }
}

let io

export const injectSocket = (s: SocketIO) => {
  io = s
}

export { io }
