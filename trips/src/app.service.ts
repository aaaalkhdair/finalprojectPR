import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Trip } from './entity.js';
import { Repository } from 'typeorm';
import { TripStatus } from './dtos/tripstatus.js';
import { TripCreat } from './dtos/tripcreat.dto.js';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Trip)
    private readonly userRepository: Repository<Trip>,
  ) {}
  public async creat(body: TripCreat) {
    const newTrip = await this.userRepository.create({
      riderId: body.riderId,
      status: TripStatus.CREATED,
    });
    await this.userRepository.save(newTrip);
    return { message: 'save is done ' };
  }
  public async getByOne(id: number) {
    if (!id) throw new BadRequestException('Id Not Found');
    const trip = await this.userRepository.findOne({ where: { id } });
    if (!trip) throw new BadRequestException('Trip Not Found');
    return trip;
  }
  public async accepte(id: number, driverId: number) {
    const trip = await this.getByOne(id);
    if (trip.status !== TripStatus.CREATED)
      throw new BadRequestException('Trip is not available');
    trip.driverId = driverId;
    trip.status = TripStatus.ACCEPTED;
    await this.userRepository.save(trip);
  }
  public async reject(tripId: number) {
    const trip = await this.getByOne(tripId);
    trip.status = TripStatus.REJECTED;
    return await this.userRepository.save(trip);
  }
  public async arrive(tripId: number, driverId: number) {
    const trip = await this.getByOne(tripId);
    if (trip.driverId !== driverId)
      throw new BadRequestException('Not your trip');
    if (trip.status !== TripStatus.ACCEPTED)
      throw new BadRequestException('Trip must be accepted first');
    trip.status = TripStatus.ARRIVED;
    return await this.userRepository.save(trip);
  }
  public async start(tripId: number, driverId: number) {
    const trip = await this.getByOne(tripId);
    if (trip.driverId !== driverId)
      throw new BadRequestException('Not your trip');
    if (trip.status !== TripStatus.ARRIVED)
      throw new BadRequestException('Driver must arrive first');
    trip.status = TripStatus.STARTED;
    return await this.userRepository.save(trip);
  }
  public async end(tripId: number, driverId: number) {
    const trip = await this.getByOne(tripId);
    if (trip.driverId !== driverId)
      throw new BadRequestException('Not your trip');
    if (trip.status !== TripStatus.STARTED)
      throw new BadRequestException('Trip must be started first');
    trip.status = TripStatus.ENDED;
    return await this.userRepository.save(trip);
  }
  public async cancel(tripId: number, riderId: number) {
    const trip = await this.getByOne(tripId);
    if (trip.riderId !== riderId)
      throw new BadRequestException('Not your trip');
    if (
      trip.status === TripStatus.ENDED ||
      trip.status === TripStatus.CANCELED
    ) {
      throw new BadRequestException('Cannot cancel this trip');
    }
    trip.status = TripStatus.CANCELED;
    return await this.userRepository.save(trip);
  }
  public async getAvailable() {
    const trip = await this.userRepository.find({
      where: { status: TripStatus.CREATED },
    });
    return trip;
  }
}
