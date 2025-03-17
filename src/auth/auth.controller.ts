import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(200)
  @ApiOperation({ summary: 'Authentifier un utilisateur et obtenir un JWT' })
  @ApiBody({
    schema: {
      properties: {
        email: { example: 'john@example.com' },
        password: { example: 'password123' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Connexion réussie, retourne le token JWT',
    schema: {
      properties: {
        access_token: { example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
      },
    },
  })
  async login(@Body() body: { email: string; password: string }) {
    console.log('Received login request:', body);
    const user = await this.authService.validateUser(body.email, body.password);
    return this.authService.login(user);
  }
}
