import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { JwtModule } from '@nestjs/jwt';
import { TripsGateway } from './trips.gateway.js';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'user-service',
        transport: Transport.TCP,
        options: { host: 'localhost', port: 3001 },
      },
      {
        name: 'trip-service',
        transport: Transport.TCP,
        options: { host: 'localhost', port: 3002 },
      },
    ]),
    JwtModule.register({
      global: true,
      secret: 'thisIsPrivateKeyPtraRide200425',
    }),
  ],
  controllers: [AppController],
  providers: [AppService, TripsGateway],
})
export class AppModule {} 
