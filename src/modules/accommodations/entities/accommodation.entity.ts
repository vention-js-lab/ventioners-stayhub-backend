import { AccommodationType, AccommodationStatus } from 'src/shared/constants';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Amenity } from './amenity.entity';
import { AccommodationCategory } from './accommodation-category.entity';

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
  pricePerNight: number;

  @Column({
    type: 'enum',
    enum: AccommodationType,
  })
  @Index()
  type: AccommodationType;

  @Column({
    type: 'enum',
    enum: AccommodationStatus,
    default: AccommodationStatus.PENDING_APPROVAL,
  })
  status: AccommodationStatus;

  @OneToMany(() => Amenity, (amenity) => amenity.accommodation)
  amenities: Amenity[];

  @ManyToOne(() => AccommodationCategory, (category) => category.accommodations)
  category: AccommodationCategory;

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt: Date;
}
