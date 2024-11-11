import { AccommodationStatus } from 'src/shared/constants';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
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

  @Column('text', { array: true })
  type: string[];

  @Column({
    type: 'enum',
    enum: AccommodationStatus,
    default: AccommodationStatus.PENDING_APPROVAL,
  })
  status: AccommodationStatus;

  @ManyToMany(() => Amenity, (amenity) => amenity.accommodations)
  @JoinTable({
    name: 'accommodation_amenities',
    joinColumn: {
      name: 'accommodationId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'amenityId',
      referencedColumnName: 'id',
    },
  })
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
