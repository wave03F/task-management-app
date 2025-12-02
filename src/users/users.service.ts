import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

export interface UserEntity {
  id: number;
  username: string;
  passwordHash: string;
}

@Injectable()
export class UsersService {
  private readonly users: UserEntity[] = [
    {
      id: 1,
      username: 'user',
      passwordHash: bcrypt.hashSync('password', 10),
    },
  ];

  async findByUsername(username: string): Promise<UserEntity | undefined> {
    return this.users.find((u) => u.username === username);
  }
}
