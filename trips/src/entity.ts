import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TripStatus } from './dtos/tripstatus.js';
@Entity()
export class Trip {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  riderId: number;

  @Column({ nullable: true })
  driverId: number;

  @Column({
    type: 'enum',
    enum: TripStatus,
    default: TripStatus.CREATED,
  })
  status: TripStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
