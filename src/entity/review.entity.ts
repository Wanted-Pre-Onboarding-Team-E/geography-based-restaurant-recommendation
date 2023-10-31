import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Restaurant } from './restaurant.entity';

@Entity('reviews')
export class Review {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' }) // NOTE: 외래키를 가진 쪽에만 작성
  user!: User;

  @ManyToOne(() => Restaurant)
  @JoinColumn({ name: 'restaurant_id' }) // NOTE: 외래키를 가진 쪽에만 작성
  restaurant!: Restaurant;

  @Column({ type: 'double' })
  rating: number;

  @Column({ type: 'varchar', length: 255 })
  content: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn({ nullable: true })
  updatedAt: Date;
}
