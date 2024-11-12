import { AmenityCategory } from 'src/shared/constants';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Accommodation } from './accommodation.entity';

@Entity()
export class Amenity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 100,
  })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: AmenityCategory,
    default: AmenityCategory.FEATURES,
  })
  category: AmenityCategory;

  @Column({ type: 'varchar' })
  icon: string;

  @ManyToOne(() => Accommodation)
  accommodation: Accommodation;

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt: Date;
}
