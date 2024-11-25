import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Accommodation } from './accommodation.entity';

@Entity()
export class Image {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  url: string;

  @ManyToOne(() => Accommodation, (accommodation) => accommodation.images, {
    onDelete: 'CASCADE',
  })
  accommodation: Accommodation;

  @Column({ default: 0 })
  order: number;
}
