import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  /**
   * Constructor for the JWT strategy.
   *
   * This strategy expects a JWT to be sent in the `Authorization` header
   * with the format `Bearer <jwt>`. The `ignoreExpiration` option is set to
   * `false` so that expired JWTs are not accepted. The `secretOrKey` option
   * is set to `'yourSecretKey'` but you should replace it with your own
   * secret key.
   */
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'yourSecretKey',
    });
  }

  /**
   * Validate a user with a JWT payload.
   *
   * @param payload - The payload from the JWT.
   * @returns The user if valid, otherwise {@link UnauthorizedException}.
   */
  async validate(payload: any) {
    return { userId: payload.sub, username: payload.username };
  }
}
