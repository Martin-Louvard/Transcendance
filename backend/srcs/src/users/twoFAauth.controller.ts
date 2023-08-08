import {Controller, Post, Delete, UseGuards, UnauthorizedException, Body} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { Param } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthService } from 'src/auth/auth.service';

@Controller('2fa')
  @ApiTags('2fa')
  export class TwoFactorAuthenticationController {
    constructor(private userService: UsersService, private prisma: PrismaService) {}
  
    @Post(':username/generate')
    async register(@Param('username') username: string) {
      const { otpauthUrl } = await this.userService.generateTwoFactorAuthenticationSecret(username);
   
      return this.userService.generateQrCodeDataURL(otpauthUrl);
    }

    @Post(':username/turn-on')
    @UseGuards(JwtAuthGuard)
    async turnOnTwoFactorAuthentication(@Param('username') username: string, @Body() body) {
      const isCodeValid = await 
        this.userService.isTwoFactorAuthenticationCodeValid(
          body.twoFactorAuthenticationCode,
          username,
        );

        if (!isCodeValid) {
        throw new UnauthorizedException('Wrong authentication code');
      }
      await this.prisma.user.update({where: {username}, data: {twoFAEnabled: true}});
      return this.userService.findOne(username)
    }

    @Post(':username/login')
    @UseGuards(JwtAuthGuard)
    async loginWith2fa(@Param('username') username: string, @Body() body){
      const isCodeValid = await 
      this.userService.isTwoFactorAuthenticationCodeValid(
        body.twoFactorAuthenticationCode,
        username,
      );
      console.log(isCodeValid)
      if (!isCodeValid) {
        throw new UnauthorizedException('Wrong authentication code');
      }
      return this.userService.findOne(username)
    }

    @Delete(':username')
    @UseGuards(JwtAuthGuard)
    async delete2fa(@Param('username') username: string){
      await this.prisma.user.update({where: {username}, data: {twoFAEnabled: false}});
      return this.userService.findOne(username)
    }


}