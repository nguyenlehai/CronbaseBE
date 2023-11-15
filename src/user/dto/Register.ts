import { IsEmail, IsEmpty, IsNotEmpty } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsEmpty()
  otp?: string;

  @IsEmpty()
  twofa?: string;

  @IsEmpty()
  ip?: string;

  @IsEmpty()
  timeLogin?: Date;
}
