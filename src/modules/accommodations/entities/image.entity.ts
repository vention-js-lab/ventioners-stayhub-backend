import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Accommodation } from './accommodation.entity';

@Entity()
export class Image {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  url: string;

  @Column({ nullable: true })
  thumbnailUrl?: string;

  @Column({ nullable: true })
  blurhash?: string;

  @Column({ default: 0 })
  order: number;

  @ManyToOne(() => Accommodation, (accommodation) => accommodation.images, {
    onDelete: 'CASCADE',
  })
  accommodation: Accommodation;
}
