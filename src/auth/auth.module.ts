import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { UsersModule } from '../users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      /**
       * Factory function to create JWT module options.
       * Retrieves JWT secret and expiration time from the configuration service.
       *
       * @param configService - The ConfigService instance used to access environment variables.
       * @returns An object containing the JWT secret and sign options.
       */
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET', 'defaultSecretForDev'), // Default pour dev
        signOptions: {
          expiresIn: `${configService.get<number>('JWT_EXPIRATION', 3600)}s`, // 1h par défaut
        },
      }),
    }),
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
