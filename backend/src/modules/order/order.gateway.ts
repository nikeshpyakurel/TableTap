import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { AddOrderDto, CreateOrderDto } from './dto/create-order.dto';
import { OrderService } from './order.service';

@WebSocketGateway({
  namespace: 'orders',
  cors: {
    origin: '*',
  },
})
export class OrderGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly orderService: OrderService,
  ) {}

  @WebSocketServer()
  server: Server;

  // Handle new client connection
  handleConnection(client: Socket) {
    // Extract query parameters from the client handshake
    const { room } = client.handshake.query;
   
    if (!room ) {
      console.log('Missing room, disconnecting client:', client.id);
      client.disconnect();
      return;
    }

    // Log the connection
    console.log(
      `Client connected: ${client.id} - Room: ${room}`,
    );

    // Join the client to the room
    client.join(room);
  }

  // Handle client disconnection
  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('createOrder')
  async create(
    @MessageBody() createOrderDto: CreateOrderDto,
    @ConnectedSocket() client: Socket,
  ) {
    console.log("********************");
    console.log(createOrderDto);
    const room = client.handshake.query.room as string;
    const order = await this.orderService.create(room,createOrderDto);
    this.server.to(room).emit('order',order);
  }


  // @SubscribeMessage('addOrder')
  // async addOrder(
  //   @MessageBody() addOrderDto: AddOrderDto,
  //   @ConnectedSocket() client: Socket,
  // ) {
  //   // Extract `room` and `table` from the query
  //   const room = client.handshake.query.room as string;
  //   const order = await this.orderService.addOrder(addOrderDto);
  //   this.server.to(room).emit('addOrder',order);

    // return order;
  }

