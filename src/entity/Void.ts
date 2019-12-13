import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ObjectType, Field, ID } from 'type-graphql';
import slug from '~/utils/slug';

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

  @BeforeInsert()
  private slugify() {
    if (this.slug === undefined) {
      this.slug = slug(this.name);
    }
  }
}
