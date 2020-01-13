import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from './User';
import { ObjectType, Field, ID } from 'type-graphql';

export enum RolesPrivileges {
  USER = 'user',
  MOD = 'moderator',
  EDITOR = 'editor',
  ARTIST = 'artist',
  COORD = 'coordinator',
  ADMIN = 'administrator',
}

@ObjectType('RoleNode')
@Entity({ name: 'roles' })
export class Role {

  @Field(type => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ unique: true })
  name: string;

  @Field()
  @Column()
  description: string;

  @Column({
    type: 'enum',
    enum: RolesPrivileges,
    default: RolesPrivileges.USER,
  })
  privilege: RolesPrivileges;

  @OneToMany(type => User, user => user.role)
  users: User[];

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;

}
