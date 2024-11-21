import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Accommodation } from './accommodation.entity';
import { User } from 'src/modules/users/entities/user.entity';

@Entity({ name: 'accommodation_like' })
@Unique(['user', 'accommodation'])
export class Wishlist {
  @PrimaryGeneratedColumn('uuid') id: string;
  @ManyToOne(() => User, (user) => user.accommodationLikes, {
    onDelete: 'CASCADE',
  })
  user?: User;
  @ManyToOne(() => Accommodation, (accommodation) => accommodation.likes, {
    onDelete: 'CASCADE',
  })
  accommodation?: Accommodation;
  @CreateDateColumn({ type: 'timestamptz', name: 'liked_at' }) likedAt!: Date;
}
