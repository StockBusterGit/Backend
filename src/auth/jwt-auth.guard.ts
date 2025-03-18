import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { ALLOW_ANONYMOUS_KEY } from '../auth/decorators/allow-anonymous.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const allowAnonymous = this.reflector.get<boolean>(
      ALLOW_ANONYMOUS_KEY,
      context.getHandler(),
    );
    if (allowAnonymous) {
      return true;
    }
    return super.canActivate(context);
  }
}
