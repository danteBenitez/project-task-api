import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ENVIRONMENT } from 'src/config/env';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  providers: [AuthService, JwtStrategy],
  imports: [UsersModule, ConfigModule, JwtModule.registerAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (config: ConfigService) => {
      return {
        global: true,
        secret: config.get<ENVIRONMENT["SECRET"]>('SECRET'),
        signOptions: {
          expiresIn: '1d'
        }
      }
    }
  })],
  exports: [JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
