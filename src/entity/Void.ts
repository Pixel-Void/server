import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import { ObjectType, Field, ID } from 'type-graphql';
import slug from '~/utils/slug';
import { UsersVoids } from './UsersVoids';
import { Galaxy } from './Galaxy';

@ObjectType('VoidNode')
@Entity({ name: 'voids' })
export class Void {
  @Field(type => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ nullable: false, unique: true })
  name: string;

  @Field()
  @Column({ nullable: false })
  nsfw: boolean;

  @Field()
  @Column({ unique: true })
  slug: string;

  @Field()
  @CreateDateColumn()
  createdAt: string;

  @Field()
  @UpdateDateColumn()
  updatedAt: string;

  @OneToMany(type => UsersVoids, userToVoids => userToVoids.void)
  users!: UsersVoids[];

  @OneToMany(type => Galaxy, galaxy => galaxy.void)
  galaxies!: Galaxy[];

  @BeforeInsert()
  private slugify() {
    if (this.slug === undefined) {
      this.slug = slug(this.name);
    }
  }
}
