// src/task/task.module.ts

import { Module } from '@nestjs/common';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './task.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Task])], // ลงทะเบียน Entity
  controllers: [TaskController],
  providers: [TaskService],
})
export class TaskModule {}