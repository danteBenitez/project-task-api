import { Injectable } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { UserNotFoundError, UsersService } from 'src/users/users.service';

export class IncorrectLoginError extends Error {
    message = 'Incorrect username or password';
}

@Injectable()
export class AuthService {
    constructor(
        private userService: UsersService
    ) {}

    async signIn(username: string, password: string): Promise<User> {
        try {
            const user = await this.userService.findOneByNameOrEmail({
                name: username
            });

            const matchPassword = this.userService.comparePassword(user, password);

            if (!matchPassword) throw new IncorrectLoginError();

            return user;

        } catch(e) {
            if (e instanceof UserNotFoundError) {
                throw new IncorrectLoginError();
            }
            console.log(e.message);
            throw e;
        }
    }
}
