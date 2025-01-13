import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

@Controller()
export class AppController {
  @Get('protected')
  @UseGuards(JwtAuthGuard)
  /**
   * This is a protected route that requires a valid JWT to be
   * passed in the Authorization header. It returns a JSON object
   * with a simple message.
   * @returns {object} A JSON object with the message.
   * @example
   * {
   *   "message": "This is a protected route"
   * }
   */
  getProtectedData() {
    return { message: 'This is a protected route' };
  }
}
