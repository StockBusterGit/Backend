import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  /**
   * Constructor for the JWT strategy.
   *
   * This strategy expects a JWT to be sent in the `Authorization` header
   * with the format `Bearer <jwt>`. The `ignoreExpiration` option is set to
   * `false` so that expired JWTs are not accepted. The `secretOrKey` is
   * loaded from environment variables via the ConfigService.
   */
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET', 'defaultSecretForDev'),
    });
  }

  /**
   * Validate a user with a JWT payload.
   *
   * @param payload - The payload from the JWT.
   * @returns The user object if valid
   */
  async validate(payload: any) {
    return { userId: payload.sub, username: payload.username };
  }
}
