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
}
