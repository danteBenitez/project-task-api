import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ENVIRONMENT } from 'src/config/env';

@Module({
  providers: [AuthService],
  imports: [UsersModule, JwtModule.registerAsync({
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
  controllers: [AuthController],
})
export class AuthModule {}
