import { IsEmail, Length } from 'class-validator';

export class CredentialsDto {
  @IsEmail()
  email: string;

  @Length(8, 30)
  password: string;
}
