import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Accommodation } from './accommodation.entity';
import { User } from 'src/modules/users/entities/user.entity';

@Entity({ name: 'wishlist' })
@Unique(['user', 'accommodation'])
export class Wishlist {
  @PrimaryGeneratedColumn('uuid') id: string;

  @ManyToOne(() => User, (user) => user.wishlist, {
    onDelete: 'CASCADE',
  })
  user?: User;

  @ManyToOne(() => Accommodation, (accommodation) => accommodation.wishlists, {
    onDelete: 'CASCADE',
  })
  accommodation?: Accommodation;

  @CreateDateColumn({ type: 'timestamptz', name: 'liked_at' }) likedAt!: Date;
}
