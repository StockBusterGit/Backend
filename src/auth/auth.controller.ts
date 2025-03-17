import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(200)
  @ApiOperation({ summary: 'Login a user and return a JWT token' })
  @ApiBody({
    description: 'User login credentials',
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'test@example.com' },
        password: { type: 'string', example: 'password123' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    schema: {
      type: 'object',
      properties: {
        access_token: { type: 'string', example: 'JWT_TOKEN_HERE' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Invalid email or password' })
  /**
   * Login a user and return a JWT token
   * @param body User login credentials
   * @returns A JWT token representing the user's access token
   */
  async login(@Body() body: { email: string; password: string }) {
    console.log('Received login request:', body);
    const user = await this.authService.validateUser(body.email, body.password);
    return this.authService.login(user);
  }
}
