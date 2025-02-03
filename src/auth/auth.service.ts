import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    console.log('Validating user:', email); // Log pour traquer les appels

    const user = await this.usersService.findByEmail(email);
    if (!user) {
      console.error('User not found:', email); // Log en cas d'absence
      throw new UnauthorizedException('Invalid email or password');
    }

    if (user.password !== password) {
      console.error('Invalid password for user:', email); // Log mot de passe invalide
      throw new UnauthorizedException('Invalid email or password');
    }

    // Retirer le mot de passe du résultat retourné
    const { password: _, ...result } = user;
    return result;
  }

  async login(user: any) {
    console.log('User logged in:', user); // Log utilisateur connecté
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
