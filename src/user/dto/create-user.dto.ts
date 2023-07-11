import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
export class CreateUserDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty({
    minimum: 6,
    maximum: 20,
    description:
      'At least 1 lowercase, 1 uppsercase, 1 special character & 1 digit',
  })
  @IsString()
  @MinLength(6)
  @MaxLength(20)
  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=]).*$/, {
    message: 'Password too weak',
  })
  password: string;
}
