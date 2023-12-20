import { Controller, Body, Post, UnauthorizedException, HttpStatus, HttpCode } from '@nestjs/common';
import { AuthService, IncorrectLoginError } from './auth.service';
import { UserConflictError, UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from './dto/sign-in.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  @Post('/sign-in')
  async signIn(
    @Body() signInDto: SignInDto,
  ): Promise<{ access_token: string }> {
    try {
      const user = await this.authService.signIn(
        signInDto.username,
        signInDto.password,
      );

      const payload = {
        sub: user.user_id,
        name: user.name,
      };
      const token = await this.jwtService.signAsync(payload);

      return {
        access_token: token,
      };
    } catch (e) {
      if (e instanceof IncorrectLoginError) {
        throw new UnauthorizedException(e.message);
      }
      console.error(e);
      throw e;
    }
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('/sign-up')
  async signUp(
    @Body() signUpDto: CreateUserDto,
  ): Promise<{ access_token: string }> {
    try {
      const user = await this.userService.create(signUpDto);

      const payload = {
        sub: user.user_id,
        name: user.name,
      };
      const token = await this.jwtService.signAsync(payload);

      return {
        access_token: token,
      };
    } catch (e) {
      if (e instanceof UserConflictError) {
        throw new UnauthorizedException(e.message);
      }
      console.error(e);
      throw e;
    }
  }
}
