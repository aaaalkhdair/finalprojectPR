import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  MinLength,
} from 'class-validator';
import { UserRole } from './userrole.dto.js';

export class Login {
  @IsNotEmpty()
  @IsString()
  @Length(10, 180)
  @IsEmail()
  email: string;
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}
