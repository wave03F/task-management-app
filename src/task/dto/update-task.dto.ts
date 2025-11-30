// src/task/dto/update-task.dto.ts
import { TaskStatus } from '../task.entity';
import { IsOptional, IsIn, IsString, IsNotEmpty } from 'class-validator';

export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  title?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description?: string;

  @IsOptional()
  @IsIn(Object.values(TaskStatus)) // ตรวจสอบสถานะว่าถูกต้องตาม enum
  status?: TaskStatus;
}