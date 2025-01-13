import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';

@Controller('auth')
@ApiTags('Auth') // Groupe pour Swagger
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(200) // Explicitement indiquer un code 200 pour les réussites
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
  async login(@Body() body: { email: string; password: string }) {
    const user = await this.authService.validateUser(body.email, body.password);
    return this.authService.login(user);
  }
}
