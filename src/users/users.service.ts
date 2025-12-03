import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from './user.entity';
import { OnModuleInit } from '@nestjs/common';

@Injectable()
export class UsersService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async onModuleInit() {
    // Seed a default user if not exists
    const exists = await this.userRepo.findOne({ where: { username: 'user' } });
    if (!exists) {
      const passwordHash = await bcrypt.hash('password', 10);
      const user = this.userRepo.create({ username: 'user', passwordHash });
      await this.userRepo.save(user);
    }
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { username } });
  }

  async createUser(username: string, password: string): Promise<User> {
    const existing = await this.userRepo.findOne({ where: { username } });
    if (existing) {
      throw new Error('Username already exists');
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const user = this.userRepo.create({ username, passwordHash });
    return this.userRepo.save(user);
  }

  async updateUser(
    id: number,
    data: { username?: string; password?: string },
  ): Promise<User> {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) {
      throw new Error('User not found');
    }
    if (data.username && data.username !== user.username) {
      const dup = await this.userRepo.findOne({ where: { username: data.username } });
      if (dup && dup.id !== id) {
        throw new Error('Username already exists');
      }
      user.username = data.username;
    }
    if (data.password) {
      user.passwordHash = await bcrypt.hash(data.password, 10);
    }
    return this.userRepo.save(user);
  }
}
