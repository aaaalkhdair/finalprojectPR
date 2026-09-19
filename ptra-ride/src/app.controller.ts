import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AppService } from './app.service.js';
import { ClientProxy } from '@nestjs/microservices';
import { CreatUser, Login, UpdateUser } from './interface/interface.js';
import { AuthGuard } from './auth.guard.js';
import { TripsGateway } from './trips.gateway.js';
import { firstValueFrom } from 'rxjs';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject('user-service') private readonly userCleint: ClientProxy,
    @Inject('trip-service') private readonly tripCleint: ClientProxy,
    private readonly tripsGateway: TripsGateway,
  ) {} 

  @Post('auth/register')
  public creatUser(@Body() body: CreatUser) {
    return this.userCleint.send('user-creat', { body });
  }
  @Post('auth/login')
  @HttpCode(HttpStatus.OK)
  public loginUser(@Body() body: Login) {
    return this.userCleint.send('login-user', { body });
  }
  @Get('user-current')
  @UseGuards(AuthGuard)
  public currentUser(@Req() request : any) {
    const payload = request['user'];
    return this.userCleint.send('user-current',{ id : payload.id})
  }
  @Get('user')
  @UseGuards(AuthGuard)
  public getAllUser() {
    return this.userCleint.send('user-get-all', {});
  }
  @Get('user/:id') 
  @UseGuards(AuthGuard)
  public getSingleUser(@Param('id', ParseIntPipe) id: number) {
    return this.userCleint.send('user-get-single', { id });
  }
  @Patch('user/:id')
  @UseGuards(AuthGuard)
  public updateUser(
    @Body() body: UpdateUser,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.userCleint.send('user-update', { body, id });
  }
  @Delete('user/:id')
  @UseGuards(AuthGuard)
  public removeUser(@Param('id', ParseIntPipe) id: number) {
    return this.userCleint.send('user-remove', { id });
  }

  @Post('trips')
  @UseGuards(AuthGuard)
  public async createTrip(@Req() req: any) {
    const user = req['user'];
    if (user.role !== 'RIDER') {
      throw new ForbiddenException('Only riders can create trips');
    }
    const trip = await firstValueFrom(
      this.tripCleint.send('trip-create', {
        body: { riderId: user.id, tripStatus: 'created' },
      }),
    );
    this.tripsGateway.notifyNewTrip(trip);
    return trip;
  }

  @Get('trips/available')
  @UseGuards(AuthGuard)
  public getAvailableTrips(@Req() req: any) {
    const user = req['user'];
    if (user.role !== 'DRIVER') {
      throw new ForbiddenException('Only drivers can view available trips');
    }
    return this.tripCleint.send('trip-get-available', {});
  }

  @Get('trips/:id')
  @UseGuards(AuthGuard)
  public getOneTrip(@Param('id', ParseIntPipe) id: number) {
    return this.tripCleint.send('trip-get-one', { id });
  }

  @Patch('trips/:id/accept')
  @UseGuards(AuthGuard)
  public async acceptTrip(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: any,
  ) {
    const user = req['user'];
    if (user.role !== 'DRIVER') {
      throw new ForbiddenException('Only drivers can accept trips');
    }
    const trip = await firstValueFrom(
      this.tripCleint.send('trip-accept', { id, driverId: user.id }),
    );
    this.tripsGateway.notifyTripStatus(id, 'accepted', trip);
    return trip;
  }

  @Patch('trips/:id/arrive')
  @UseGuards(AuthGuard)
  public async arriveTrip(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: any,
  ) {
    const user = req['user'];
    if (user.role !== 'DRIVER') {
      throw new ForbiddenException('Only drivers can mark arrival');
    }
    const trip = await firstValueFrom(
      this.tripCleint.send('trip-arrive', { id, driverId: user.id }),
    );
    this.tripsGateway.notifyTripStatus(id, 'arrived', trip);
    return trip;
  }

  @Patch('trips/:id/start')
  @UseGuards(AuthGuard)
  public async startTrip(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: any,
  ) {
    const user = req['user'];
    if (user.role !== 'DRIVER') {
      throw new ForbiddenException('Only drivers can start trips');
    }
    const trip = await firstValueFrom(
      this.tripCleint.send('trip-start', { id, driverId: user.id }),
    );
    this.tripsGateway.notifyTripStatus(id, 'started', trip);
    return trip;
  }

  @Patch('trips/:id/end')
  @UseGuards(AuthGuard)
  public async endTrip(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: any,
  ) {
    const user = req['user'];
    if (user.role !== 'DRIVER') {
      throw new ForbiddenException('Only drivers can end trips');
    }
    const trip = await firstValueFrom(
      this.tripCleint.send('trip-end', { id, driverId: user.id }),
    );
    this.tripsGateway.notifyTripStatus(id, 'ended', trip);
    return trip;
  }

  @Patch('trips/:id/cancel')
  @UseGuards(AuthGuard)
  public async cancelTrip(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: any,
  ) {
    const user = req['user'];
    if (user.role !== 'RIDER') {
      throw new ForbiddenException('Only riders can cancel trips');
    }
    const trip = await firstValueFrom(
      this.tripCleint.send('trip-cancel', { id, riderId: user.id }),
    );
    this.tripsGateway.notifyTripStatus(id, 'canceled', trip);
    return trip;
  }
}
