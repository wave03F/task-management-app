// src/task/dto/create-task.dto.ts
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;
  // สถานะจะถูกกำหนดเป็น default: OPEN ใน Entity
}