import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Accommodation } from './accommodation.entity';

@Entity()
export class AccommodationCategory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 125,
  })
  name: string;

  @Column({
    type: 'varchar',
    length: 255,
  })
  icon: string;

  @OneToMany(() => Accommodation, (accommodation) => accommodation.category)
  accommodations: Accommodation[];

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt: Date;
}
