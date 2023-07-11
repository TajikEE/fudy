import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { LoginResDto } from './dto/login-response.dto';
import { GetMeResDto } from './dto/get-me-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}
  async login(loginDto: LoginDto): Promise<LoginResDto> {
    const { email, password } = loginDto;
    const user = await this.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const token = this.generateJwtToken(user);
    return { statusCode: 201, token };
  }

  async getMe(email: string): Promise<GetMeResDto> {
    const user = await this.userService.findUserByEmail(email);
    return {
      statusCode: 200,
      id: user.id,
      email: user.email,
    };
  }

  private async validateUser(
    email: string,
    password: string,
  ): Promise<User | null> {
    const user = await this.userService.findUserByEmail(email);
    if (user) {
      const storedHash = user.password;
      const isPasswordValid = await bcrypt.compare(password, storedHash);
      if (isPasswordValid) {
        return user;
      }
    }
    return null;
  }

  private generateJwtToken(user: User): string {
    const payload = { email: user.email };
    return this.jwtService.sign(payload);
  }
}
