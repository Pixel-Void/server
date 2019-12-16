import {
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  Entity,
  Index,
} from 'typeorm';
import { User } from './User';
import { Void } from './Void';
import { ObjectType, Field } from 'type-graphql';

@ObjectType('VoidSubscriptionNode')
@Entity()
@Index(['userId', 'voidId'], { unique: true })
export class UsersVoids {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId!: string;

  @Column()
  voidId!: string;

  @Field(type => Date, { name: 'joinedAt' })
  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;

  @ManyToOne(type => User, user => user.voids)
  user!: User;

  @Field(type => Void)
  @ManyToOne(type => Void, voidEntity => voidEntity.users)
  void!: Void;

}
