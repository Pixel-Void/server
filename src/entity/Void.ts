import {
  Entity,
  ObjectIdColumn,
  ObjectID,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
} from 'typeorm';
import { ObjectType, Field, ID } from 'type-graphql';
import { v1 as uuidV1 } from 'uuid';
import slug from '~/utils/slug';

@ObjectType('VoidNode')
@Entity({ name: 'voids' })
export class Void {
  @Field(type => ID)
  @ObjectIdColumn()
  id: ObjectID;

  @Column({ unique: true, update: false })
  uuid: string;

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

  @BeforeInsert()
  private generateUuid() {
    this.uuid = uuidV1();
  }
}
