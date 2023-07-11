import { Body, Controller, Get, Post, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LoginDto } from './dto/login.dto';
import { LoginResDto } from './dto/login-response.dto';
import { ApiTags, ApiBody, ApiCreatedResponse } from '@nestjs/swagger';
import { GetMeResDto } from './dto/get-me-response.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiBody({ type: LoginDto })
  @ApiCreatedResponse({ type: LoginResDto })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiCreatedResponse({ type: GetMeResDto })
  async getMe(@Req() req): Promise<GetMeResDto> {
    return this.authService.getMe(req.user.email);
  }
}
