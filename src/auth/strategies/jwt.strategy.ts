import { UnauthorizedException, Injectable } from '@nestjs/common';
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ENVIRONMENT } from "src/config/env";
import { UserNotFoundError, UsersService } from "src/users/users.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private userService: UsersService,
        private configService: ConfigService
    ) {
        super({
          jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
          ignoreExpiration: false,
          secretOrKey: configService.get<ENVIRONMENT["SECRET"]>('SECRET'),
        });
    }

    async validate(payload: any) {
        try {
            return await this.userService.findOne(payload.sub);
        } catch(err) {
            if (err instanceof UserNotFoundError) {
                throw new UnauthorizedException();
            }
            throw err;
        }
    }
}