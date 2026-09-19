import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  MinLength,
} from 'class-validator';

export enum userrole {
  ADMIN = 'ADMIN',
  RIDER = 'RIDER',
  DRIVER = 'DRIVER',
}

export class CreatUser {
  @IsNotEmpty()
  @IsString()
  @Length(2, 50)
  fname: string;

  @IsNotEmpty()
  @IsString()
  @Length(2, 50)
  lname: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;

  @IsNotEmpty()
  @IsEnum(userrole)
  userrole: userrole;
}

export class UpdateUser {
  @IsOptional()
  @IsString()
  @Length(2, 50)
  fname?: string;

  @IsOptional()
  @IsString()
  @Length(2, 50)
  lname?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;
}

export class Login {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
