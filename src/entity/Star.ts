import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { ObjectType, Field, ID } from 'type-graphql';

import { Upload } from '~/services/upload-service';

import { User } from './User';
import { Galaxy } from './Galaxy';

@ObjectType('StarNode')
@Entity({ name: 'stars' })
export class Star implements Partial<Upload> {
  @Field(type => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field({ nullable: false })
  @Column()
  url: string;

  @Field({ nullable: false })
  @Column()
  secureUrl: string;

  @Field({ nullable: false })
  @Column()
  format: string;

  @Field({ nullable: false })
  @Column()
  width: number;

  @Field({ nullable: false })
  @Column()
  height: number;

  @Column({ nullable: false })
  galaxyId: string;

  @ManyToOne(type => User, user => user.stars)
  author!: Promise<User>;

  @ManyToOne(type => Galaxy, galaxy => galaxy.stars)
  galaxy!: Promise<Galaxy>;

}
