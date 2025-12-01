import { TaskStatus } from '../task.entity';
import { IsOptional, IsEnum, IsString, IsNotEmpty } from 'class-validator';

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
  @IsEnum(TaskStatus) // ตรวจสอบสถานะว่าถูกต้องตาม enum
  status?: TaskStatus;
}