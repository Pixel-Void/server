import {
  Entity,
  ObjectIdColumn,
  ObjectID,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeUpdate,
  AfterInsert,
  AfterLoad,
  BeforeInsert,
} from 'typeorm';
import { ObjectType, Field, ID } from 'type-graphql';
import slug from '~/utils/slug';

@ObjectType('VoidNode')
@Entity({ name: 'voids' })
export class Void {
  @Field(type => ID)
  @ObjectIdColumn()
  id: ObjectID;

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
