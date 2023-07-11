import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty({
    minimum: 6,
    maximum: 20,
  })
  @IsString()
  @MinLength(6)
  @MaxLength(20)
  password: string;
}
