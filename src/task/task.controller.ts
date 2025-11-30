// src/task/task.controller.ts

import { Controller, Get, Post, Body, Param, Patch, Delete, HttpCode, HttpStatus, UsePipes, ValidationPipe } from '@nestjs/common';
import { TaskService } from './task.service';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Controller('tasks') // Endpoint หลักคือ /tasks
@UsePipes(ValidationPipe) // ใช้สำหรับตรวจสอบ DTO
export class TaskController {
  constructor(private tasksService: TaskService) {}

  // GET /tasks - List task (ไม่มี description)
  @Get()
  getAllTasks(): Promise<Pick<Task, 'id' | 'title' | 'status'>[]> {
    return this.tasksService.getAllTasks();
  }

  // GET /tasks/:id - Get detail task
  @Get(':id')
  getTaskById(@Param('id') id: string): Promise<Task> {
    return this.tasksService.getTaskById(parseInt(id, 10));
  }

  // POST /tasks - สร้าง task
  @Post()
  @HttpCode(HttpStatus.CREATED)
  createTask(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
    return this.tasksService.createTask(createTaskDto);
  }

  // PATCH /tasks/:id - แก้ task
  @Patch(':id')
  updateTask(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    // ต้องติดตั้ง class-validator และ class-transformer ด้วย: npm install class-validator class-transformer
    return this.tasksService.updateTask(parseInt(id, 10), updateTaskDto);
  }

  // DELETE /tasks/:id - ลบ task
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT) // 204 No Content
  deleteTask(@Param('id') id: string): Promise<void> {
    return this.tasksService.deleteTask(parseInt(id, 10));
  }
}