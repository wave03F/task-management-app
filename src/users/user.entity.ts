import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  @Index({ unique: true })
  username: string;

  @Column()
  passwordHash: string;
}
