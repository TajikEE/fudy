import { JwtAuthGuard } from './jwt-auth.guard';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { LoginResDto } from './dto/login-response.dto';
import { GetMeResDto } from './dto/get-me-response.dto';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(() => {
    authService = new AuthService(null, null);
    authController = new AuthController(authService);
  });

  describe('login', () => {
    it('should return the result from authService.login', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password',
      };
      const loginResDto: LoginResDto = { statusCode: 200, token: 'token' };

      jest.spyOn(authService, 'login').mockResolvedValueOnce(loginResDto);

      const result = await authController.login(loginDto);

      expect(authService.login).toHaveBeenCalledWith(loginDto);
      expect(result).toBe(loginResDto);
    });
  });

  describe('getMe', () => {
    it('should return the result from authService.getMe', async () => {
      const email = 'test@example.com';
      const getMeResDto: GetMeResDto = { statusCode: 200, id: 1, email };

      jest.spyOn(authService, 'getMe').mockResolvedValueOnce(getMeResDto);

      const result = await authController.getMe({ user: { email } });

      expect(authService.getMe).toHaveBeenCalledWith(email);
      expect(result).toBe(getMeResDto);
    });
  });
});
