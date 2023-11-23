import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import {Server, Socket} from 'socket.io';

// import { AuthService } from './user/services/auth.service';

@WebSocketGateway({ cors: true })
export class EventGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;
  constructor() {} // private readonly authService: AuthService

  handleEmitSocket({ data, event, to }) {
    if (to) {
      this.server.to(to).emit(event, data);
    } else {
      this.server.emit(event, data);
    }
  }

  afterInit(): any {
    console.log('socket start successfully');
  }

  @SubscribeMessage('message') // lắng nghe từ client
  async handleMessage(@ConnectedSocket() socket: Socket, @MessageBody() data) {
    console.log(data);
    this.server.to(socket.data.email).emit('message', 'Please enter twofa');
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(socket: Socket, data: { email: string }) {
    try {
      const {email} = data;
      // if (!socket.rooms.has(email)) {
      // Ton tai room roi thi se khong bi disconnect
      socket.data.email = email;
      socket.join(email);
      console.log('User has joined room: ', email);
      // }
      // else {
      //   socket.disconnect();
      // }
    } catch (error) {
      socket.disconnect();
    }
  }

  async handleConnection(socket: Socket) {
    console.log('connect', socket.id);
    // const authHeader = socket.handshake.headers.authorization;
    // if (authHeader && (authHeader as string).split(' ')[1]) {
    //   try {
    //     socket.data.userId = socket.id;
    //     socket.join(socket.data.userId);
    //     console.log('connect success', socket.data.userId);
    //   } catch (e) {
    //     socket.disconnect();
    //   }
    // } else {
    //   socket.disconnect();
    // }
  }

  async handleDisconnect(@ConnectedSocket() socket: Socket) {
    console.log('disconnect', socket.id, socket.data?.userId);
  }
}
