import {
  Entity,
  ObjectIdColumn,
  ObjectID,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeUpdate,
  AfterInsert,
} from 'typeorm';
import { ObjectType, Field, ID } from 'type-graphql';
import slugify from 'slugify';

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

  @AfterInsert()
  @BeforeUpdate()
  private slugify() {
    const slug = slugify(this.name, { lower: true });
    this.slug = `${slug}-${this.id}`;
  }
}
