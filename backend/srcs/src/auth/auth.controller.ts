import { Body, Controller, Post, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthEntity } from './entities/auth.entity';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
     constructor(private authService: AuthService, private readonly jwtService: JwtService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiOkResponse({ type: AuthEntity })
  login(@Body() {username, password }: LoginDto) {
    return this.authService.login(username, password);
  }

  @Post('verify')
  verify(@Body() {access_token} ) {
    try {
      return this.jwtService.verify(access_token);
    } catch (e) {
      return undefined;
    }
  }


  @Post('42login')
  auth42(@Body() {code}) {
    return this.authService.auth42(code);
  }
}
