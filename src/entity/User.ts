import {
  Entity,
  Column,
  BeforeInsert,
  BeforeUpdate,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  getRepository,
} from 'typeorm';
import { ObjectType, Field, ID } from 'type-graphql';
import bcryptjs from 'bcryptjs';

import { UsersVoids } from './UsersVoids';
import { Galaxy } from './Galaxy';
import { Star } from './Star';
import { Role, RolesPrivileges } from './Role';

@ObjectType('UserNode')
@Entity({ name: 'users' })
export class User {
  @Field(type => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ unique: true })
  username: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  firstName?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  lastName?: string;

  @Column()
  password: string;

  @Field()
  @Column({ unique: true })
  email: string;

  @Field()
  @CreateDateColumn()
  createdAt: string;

  @Field()
  @UpdateDateColumn()
  updatedAt: string;

  @Field({ nullable: true })
  @Column('timestamp', { nullable: true })
  lastLoginAt: Date;

  @Column({ nullable: false })
  roleId: string;

  @Field(type => Role)
  @ManyToOne(type => Role, role => role.users)
  role: Role;

  @Field(type => [UsersVoids], { name: 'voidSubscriptions' })
  @OneToMany(type => UsersVoids, userToVoids => userToVoids.user)
  voids!: UsersVoids[];

  @OneToMany(type => Galaxy, galaxy => galaxy.author)
  galaxies!: Galaxy[];

  @OneToMany(type => Star, star => star.author)
  stars!: Star[];

  @BeforeInsert()
  @BeforeUpdate()
  private hashPassword() {
    if (this.password) {
      this.password = bcryptjs.hashSync(this.password);
    }
  }

  @BeforeInsert()
  private async setUserRole() {
    const userRole = await getRepository(Role).findOneOrFail({
      where: {
        privilege: RolesPrivileges.USER,
      },
      order: { createdAt: 'ASC' },
    });

    this.role = userRole;
  }
}
