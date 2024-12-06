import { Accommodation } from 'src/modules/accommodations/entities/accommodation.entity';
import { Wishlist } from 'src/modules/accommodations/entities/wishlist.entity';
import { Review } from 'src/modules/reviews/entities/review.entity';
import { UserRole } from 'src/shared/constants/user-role.constant';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 255,
    unique: true,
  })
  email: string;

  @Column({
    name: 'password_hash',
    type: 'varchar',
    length: 255,
  })
  passwordHash: string;

  @Column({
    name: 'first_name',
    type: 'varchar',
    length: 255,
  })
  firstName: string;

  @Column({
    name: 'last_name',
    type: 'varchar',
    length: 255,
  })
  lastName: string;

  @Column({
    name: 'profile_picture_url',
    type: 'varchar',
    length: 2048,
    nullable: true,
  })
  profilePictureUrl?: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: string;

  @OneToMany(() => Accommodation, (accommodation) => accommodation.owner)
  accommodations: Accommodation[];

  @OneToMany(() => Wishlist, (like) => like.user)
  wishlist?: Wishlist[];

  @OneToMany(() => Review, (review) => review.user)
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
