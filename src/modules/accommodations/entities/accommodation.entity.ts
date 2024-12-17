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
import { User } from 'src/modules/users/entities/user.entity';
import { Image } from './image.entity';
import { Review } from 'src/modules/reviews/entities/review.entity';
import { PointGeometry } from 'src/shared/helpers';

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
    length: 2000,
  })
  description: string;

  @OneToMany(() => Image, (image) => image.accommodation, {
    cascade: true,
  })
  images: Image[];

  @Column({
    type: 'varchar',
    length: 200,
  })
  location: string;

  @Column({
    type: 'geography',
    spatialFeatureType: 'Point',
    srid: 4326,
  })
  locationCoordinates: PointGeometry;

  @Column({
    name: 'price_per_night',
    type: 'decimal',
  })
  pricePerNight: number;

  @Column({
    name: 'number_of_guests',
    type: 'smallint',
    default: 1,
  })
  numberOfGuests: number;

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

  @ManyToOne(() => User, (user) => user.accommodations, {
    onDelete: 'CASCADE',
  })
  owner: User;

  @OneToMany(() => Wishlist, (wishlist) => wishlist.accommodation)
  wishlists?: Wishlist[];

  @OneToMany(() => Review, (review) => review.accommodation)
  reviews?: Review[];

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt: Date;
}
