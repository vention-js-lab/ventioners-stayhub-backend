import {
  AccommodationCategory,
  AccommodationStatus,
} from 'src/shared/constants';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Amenity } from './amenity.entity';

@Entity()
export class Accommodation {
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
  description: string;

  @Column({
    type: 'varchar',
    length: 200,
  })
  location: string;

  @Column({
    name: 'price_per_night',
    type: 'decimal',
  })
  price_per_night: number;

  @Column({
    type: 'enum',
    enum: AccommodationCategory,
  })
  categories: AccommodationCategory;

  @Column({
    type: 'enum',
    enum: AccommodationStatus,
    default: AccommodationStatus.PENDING_APPROVAL,
  })
  status: AccommodationStatus;

  @OneToMany(() => Amenity, (amenity) => amenity.accommodation)
  amenities: Amenity[];

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt: Date;
}
