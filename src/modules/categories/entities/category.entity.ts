import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Accommodation } from 'src/modules/accommodations/entities';

@Entity()
export class AccommodationCategory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 125,
    unique: true,
  })
  name: string;

  @Column({
    type: 'varchar',
    length: 125,
    unique: true,
    nullable: true,
  })
  name_ru?: string;

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
