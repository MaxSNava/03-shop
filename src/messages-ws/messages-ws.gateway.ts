import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer,  } from '@nestjs/websockets';
import { JwtService } from '@nestjs/jwt';
import { Server, Socket } from 'socket.io';
import { MessagesWsService } from './messages-ws.service';
import { NewMessageDto } from './dtos/new-message.dto';
import { JwtPayload } from 'src/auth/interfaces';

@WebSocketGateway({cors: true})
export class MessagesWsGateway implements OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer() wss: Server;

  constructor(
    private readonly messagesWsService: MessagesWsService,
    private readonly jwtService: JwtService
  ) {}

  async handleConnection(client: Socket) {
    //console.log('Cliente conectado', client.id);
    const token = client.handshake.headers.authentication as string;
    let payload: JwtPayload;
    try {
      payload = this.jwtService.verify(token);
      await this.messagesWsService.registerClient(client, payload.id);
    } catch (error) {
      client.disconnect();
      return;
    }
    this.wss.emit('clients-update', this.messagesWsService.getConnectedClients());
  }

  handleDisconnect(client: Socket) {
    //console.log('Cliente desconectado', client.id);
    this.messagesWsService.removeClient(client.id);
    this.wss.emit('clients-update', this.messagesWsService.getConnectedClients());
  }

  @SubscribeMessage('message-from-client')
  handleMessageFromClient( client:Socket, payload: NewMessageDto) {
    // ! Enviar mensaje a todos los clientes conectados
    //client.broadcast.emit('message-from-server', payload);
    // #######################################################

    this.wss.emit('message-from-server', {
      fullName: this.messagesWsService.getUserFullName(client.id),
      message: payload.message || 'Sin mensaje'
    });
  }

}
