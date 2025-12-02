import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TaskModule } from './task/task.module'; // จะสร้างในภายหลัง
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // ทำให้ ConfigService สามารถใช้ได้ทั่วโลก
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('POSTGRES_HOST'),
        port: configService.get<number>('POSTGRES_PORT'),
        username: configService.get<string>('POSTGRES_USER'),
        password: configService.get<string>('POSTGRES_PASSWORD'),
        database: configService.get<string>('POSTGRES_DB'),
        autoLoadEntities: true, // โหลด Entity ที่ถูกกำหนดโดยอัตโนมัติ
        synchronize: true, // **ใช้สำหรับ Development เท่านั้น** เพื่อสร้างตารางอัตโนมัติ
      }),
      inject: [ConfigService],
    }),
    TaskModule, // เพิ่ม TaskModule
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}