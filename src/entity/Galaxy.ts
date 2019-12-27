import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { ObjectType, Field, ID } from 'type-graphql';

import { User } from './User';
import { Void } from './Void';
import { Star } from './Star';

@ObjectType('GalaxyNode')
@Entity({ name: 'galaxies' })
export class Galaxy {
  @Field(type => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field({ nullable: false })
  @Column()
  title: string;

  @Field()
  @Column({ nullable: true })
  description?: string;

  @Field(type => User)
  @ManyToOne(type => User, user => user.galaxies)
  author!: Promise<User>;

  @Field(type => Void)
  @ManyToOne(type => Void, voidEntity => voidEntity.galaxies)
  void!: Void;

  @OneToMany(type => Star, star => star.galaxy)
  stars!: Star[];
}
