// src/task/task.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task, TaskStatus } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}

  // 1. List task (ไม่มี description)
  async getAllTasks(): Promise<Pick<Task, 'id' | 'title' | 'status'>[]> {
    const tasks = await this.taskRepository.find({
        select: ['id', 'title', 'status'], // เลือกเฉพาะ field ที่ต้องการ
        order: { id: 'ASC' }
    });
    return tasks;
  }

  // 2. Get detail task
  async getTaskById(id: number): Promise<Task> {
    const found = await this.taskRepository.findOne({ where: { id } });

    if (!found) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }

    return found;
  }

  // 3. ระบบสามารถ สร้าง task
  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const { title, description } = createTaskDto;
    
    const task = this.taskRepository.create({
      title,
      description,
      status: TaskStatus.OPEN, // ตั้งสถานะเริ่มต้น
    });

    await this.taskRepository.save(task);
    return task;
  }

  // 4. ระบบสามารถ แก้ task
  async updateTask(id: number, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const task = await this.getTaskById(id); // ใช้ method ด้านบนเพื่อตรวจสอบ task

    // อัปเดตเฉพาะ field ที่มีค่าส่งมาใน DTO
    if (updateTaskDto.title !== undefined) {
      task.title = updateTaskDto.title;
    }
    if (updateTaskDto.description !== undefined) {
      task.description = updateTaskDto.description;
    }
    if (updateTaskDto.status !== undefined) {
      task.status = updateTaskDto.status;
    }
    
    await this.taskRepository.save(task);
    return task;
  }

  // 5. ระบบสามารถ ลบ task
  async deleteTask(id: number): Promise<void> {
    const result = await this.taskRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
  }
}