import { Controller } from '@nestjs/common';
import { AppService } from './app.service.js';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TripCreat } from './dtos/tripcreat.dto.js';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('trip-create')
  public createTrip(@Payload() data: { body: TripCreat }) {
    return this.appService.creat(data.body);
  }

  @MessagePattern('trip-get-one')
  public getOneTrip(@Payload() data: { id: number }) {
    return this.appService.getByOne(data.id);
  }

  @MessagePattern('trip-get-available')
  public getAvailableTrips() {
    return this.appService.getAvailable();
  }

  @MessagePattern('trip-accept')
  public acceptTrip(@Payload() data: { id: number; driverId: number }) {
    return this.appService.accepte(data.id, data.driverId);
  }

  @MessagePattern('trip-reject')
  public rejectTrip(@Payload() data: { id: number }) {
    return this.appService.reject(data.id);
  }

  @MessagePattern('trip-arrive')
  public arriveTrip(@Payload() data: { id: number; driverId: number }) {
    return this.appService.arrive(data.id, data.driverId);
  }

  @MessagePattern('trip-start')
  public startTrip(@Payload() data: { id: number; driverId: number }) {
    return this.appService.start(data.id, data.driverId);
  }

  @MessagePattern('trip-end')
  public endTrip(@Payload() data: { id: number; driverId: number }) {
    return this.appService.end(data.id, data.driverId);
  }

  @MessagePattern('trip-cancel')
  public cancelTrip(@Payload() data: { id: number; riderId: number }) {
    return this.appService.cancel(data.id, data.riderId);
  }
}
