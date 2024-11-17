import { UserRole } from 'src/shared/constants/user-role.constant';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 255,
    unique: true,
  })
  email: string;

  @Column({
    name: 'password_hash',
    type: 'varchar',
    length: 255,
  })
  passwordHash: string;

  @Column({
    name: 'first_name',
    type: 'varchar',
    length: 255,
  })
  firstName: string;

  @Column({
    name: 'last_name',
    type: 'varchar',
    length: 255,
  })
  lastName: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: string;

  @Column('simple-array', { nullable: true })
  wishlist?: string[];

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt: Date;
}
