import { Controller, Get, Patch, Body, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('Proflie')
  getMe(@Request() req: any) {
    // req.user from JwtStrategy.validate -> { userId, username }
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Patch('Proflie')
  async updateMe(
    @Request() req: any,
    @Body() body: { username?: string; password?: string },
  ) {
    const id = req.user.userId;
    const updated = await this.usersService.updateUser(id, {
      username: body?.username,
      password: body?.password,
    });
    return { id: updated.id, username: updated.username };
  }
}
