import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNumber } from 'class-validator';

export class CreateUserResDto {
  @ApiProperty({ example: 1, description: 'User ID' })
  @IsNumber()
  id: number;

  @ApiProperty({ example: 201, description: 'Response status code' })
  @IsNumber()
  statusCode: number;

  @ApiProperty({ example: 'user@example.com', description: 'User email' })
  @IsEmail()
  email: string;
}
