import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class TripsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }
  @SubscribeMessage('join-trip')
  handleJoinTrip(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { tripId: number },
  ) {
    const roomName = `trip_${data.tripId}`;
    client.join(roomName);
    console.log(`Client ${client.id} joined room: ${roomName}`);
    return { event: 'joined-trip', room: roomName };
  }
  @SubscribeMessage('join-drivers')
  handleJoinDrivers(@ConnectedSocket() client: Socket) {
    client.join('drivers_room');
    console.log(` Driver ${client.id} joined drivers_room`);
    return { event: 'joined-drivers', room: 'drivers_room' };
  }
  @SubscribeMessage('update-driver-location')
  handleUpdateLocation(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { tripId: number; lat: number; lng: number },
  ) {
    const roomName = `trip_${data.tripId}`;
    this.server.to(roomName).emit('driver-location-updated', {
      tripId: data.tripId,
      lat: data.lat,
      lng: data.lng,
      timestamp: new Date(),
    });
  }
  notifyNewTrip(trip: any) {
    console.log(`Broadcasting new trip: #${trip.id}`);
    this.server.to('drivers_room').emit('new-trip-available', {
      message: 'New trip request available!',
      trip,
    });
    this.server.emit('new-trip-broadcast', trip);
  }
  notifyTripStatus(tripId: number, status: string, trip: any) {
    const roomName = `trip_${tripId}`;
    console.log(`Emitting status change to ${roomName}: ${status}`);
    this.server.to(roomName).emit('trip-status-changed', {
      tripId,
      status,
      trip,
      timestamp: new Date(),
    });
  }
}
