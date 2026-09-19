import { IsEnum, IsNotEmpty, IsOptional, IsString, Length, MinLength, minLength } from 'class-validator';
export class UpdateUser {
  @IsOptional()
  @IsString()
  @Length(2, 50)
  fname: string;
  @IsOptional()
  @IsString()
  @Length(2, 50)
  lname: string;
  @IsOptional()
  @IsString()
  @Length(10, 180)
  email: string;
  @IsOptional()
  @IsString()
  @MinLength(8)
  password : string;

}
