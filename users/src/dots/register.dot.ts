import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  Length,
  MinLength,
} from 'class-validator';
import { UserRole } from './userrole.dto.js';

export class CreatUSer {
  @IsNotEmpty()
  @IsString()
  @Length(2, 50)
  fname: string;
  @IsNotEmpty()
  @IsString()
  @Length(2, 50)
  lname: string;
  @IsNotEmpty()
  @IsString()
  @Length(10, 180)
  @IsEmail()
  email: string;
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;
  @IsNotEmpty()
  @IsString()
  @IsEnum(UserRole)
  userrole: UserRole;
}
