import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class LoginResDto {
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3Q3QHRlc3QuY29tIiwiaWF0IjoxNjg5MDY3NTU3LCJleHAiOjE2ODkxNTM5NTd9.JjyMnyfbn8pdlu_ghdroauI_vM62ODOuOgNPNvICBzU',
    description: 'JWT token',
  })
  @IsString()
  token: string;

  @ApiProperty({ example: 200, description: 'Response status code' })
  @IsNumber()
  statusCode: number;
}
