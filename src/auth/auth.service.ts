import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<Pick<User, 'id' | 'username'> | null> {
    const user = await this.usersService.findByUsername(username);
    if (!user) return null;

    const match = await bcrypt.compare(pass, user.passwordHash);
    if (!match) return null;

    const { id, username: name } = user;
    return { id, username: name };
  }

  async login(user: { id: number; username: string }) {
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async register(data: { username: string; password: string }) {
    const created = await this.usersService.createUser(data.username, data.password);
    const payload = { username: created.username, sub: created.id };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async logout() {
    // Stateless JWT: client should discard token. Implement blacklist if needed later.
    return { message: 'logged out' };
  }
}
