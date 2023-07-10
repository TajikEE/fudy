import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}
  async login(loginDto: LoginDto): Promise<{ token: string }> {
    const { email, password } = loginDto;
    const user = await this.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const token = this.generateJwtToken(user);
    return { token };
  }

  private async validateUser(
    email: string,
    password: string,
  ): Promise<User | null> {
    const user = await this.userService.findUserByEmail(email);
    if (user) {
      const [salt, storedHash] = user.password.split(':');
      const hashedPassword = crypto
        .pbkdf2Sync(password, salt, 1000, 64, 'sha512')
        .toString('hex');
      if (hashedPassword === storedHash) {
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
