import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  /**
   * Constructor
   * @param usersService Service utilisé pour accéder aux données des utilisateurs
   * @param jwtService Service utilisé pour générer et valider les jetons d'accès JWT
   */
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Vérifie l'email et le mot de passe d'un utilisateur
   * @param email Email de l'utilisateur
   * @param password Mot de passe de l'utilisateur
   * @returns L'utilisateur trouvée si l'email et le mot de passe sont valides, sinon une erreur UnauthorizedException
   * @throws UnauthorizedException si l'email ou le mot de passe est incorrect
   */
  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (user.password !== password) {
      throw new UnauthorizedException('Invalid email or password');
    }
    const { password: _, ...result } = user;
    return result;
  }

  /**
   * Crée un jeton d'accès JWT pour un utilisateur donné
   * @param user L'utilisateur pour lequel le jeton est créé
   * @returns Un objet contenant le jeton d'accès JWT
   */
  async login(user: any) {
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
