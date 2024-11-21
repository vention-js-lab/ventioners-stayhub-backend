import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Amenity } from 'src/modules/amenities/entities';
import { AccommodationCategory } from 'src/modules/categories/entities';
import { Wishlist } from './wishlist.entity';

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

  @Column('text', { array: true })
  images: string[];

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

  @ManyToMany(() => Amenity)
  @JoinTable({
    name: 'accommodation_amenities',
    joinColumn: {
      name: 'accommodation_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'amenity_id',
      referencedColumnName: 'id',
    },
  })
  amenities: Amenity[];

  @ManyToOne(() => AccommodationCategory, (category) => category.accommodations)
  category: AccommodationCategory;

  @OneToMany(() => Wishlist, (like) => like.accommodation)
  likes?: Wishlist[];

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt: Date;
}
