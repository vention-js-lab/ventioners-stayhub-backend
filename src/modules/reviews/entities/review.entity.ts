import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from 'src/modules/users/entities/user.entity';
import { Accommodation } from 'src/modules/accommodations/entities/accommodation.entity';

@Entity()
export class Review {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.reviews, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Accommodation, (accommodation) => accommodation.reviews, {
    onDelete: 'CASCADE',
  })
  accommodation: Accommodation;

  @Column({
    type: 'decimal',
    precision: 2,
    scale: 1,
  })
  rating: number;

  @Column({
    type: 'varchar',
    length: 255,
  })
  comment: string;

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt: Date;
}
