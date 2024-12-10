import { Accommodation } from 'src/modules/accommodations';
import { User } from 'src/modules/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BookingStatus } from '../constants';
import { Payment } from '../../payments/entities/payment.entity';

@Entity()
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, {
    onDelete: 'CASCADE',
  })
  user: User;

  @ManyToOne(() => Accommodation, {
    onDelete: 'CASCADE',
  })
  accommodation: Accommodation;

  @OneToMany(() => Payment, (payment) => payment.booking)
  payments: Payment[];

  @Column({
    name: 'check_in_date',
    type: 'timestamptz',
  })
  checkInDate: Date;

  @Column({
    name: 'check_out_date',
    type: 'timestamptz',
  })
  checkOutDate: Date;

  @Column({
    name: 'total_price',
    type: 'decimal',
  })
  totalPrice: number;

  @Column({
    name: 'number_of_guests',
    type: 'integer',
  })
  numberOfGuests: number;

  @Column({
    type: 'enum',
    enum: BookingStatus,
    default: BookingStatus.PENDING,
  })
  status: BookingStatus;

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt: Date;
}
