import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { UserRole } from "./dots/userrole.dto.js";
import { IsNotEmpty, IsString, Length } from "class-validator";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  @IsNotEmpty()
  id: number;
  @IsNotEmpty()
  @Column()
  fname: string;
  @Column()
  lname: string;
  @Column()
  email: string;
  @Column()
  password : string;
  @Column({
    type: 'enum',
    enum: UserRole,
    enumName: 'user_role_enum',
    default: UserRole.RIDER,
  })
  userrole: UserRole;
}