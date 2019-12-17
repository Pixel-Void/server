import { InputType, Field, ArgsType } from 'type-graphql';
import { User } from '~/entity/User';
import { IsEmail, IsAlphanumeric, MinLength, MaxLength } from 'class-validator';

@InputType()
export class CreateUserInput implements Partial<User> {
  @Field()
  password: string;

  @Field()
  @MinLength(5)
  @MaxLength(32)
  @IsAlphanumeric()
  username: string;

  @Field()
  @IsEmail()
  email: string;

  @Field({ nullable: true })
  firstName?: string;

  @Field({ nullable: true })
  lastName?: string;
}

@ArgsType()
export class LoginInput {
  @Field()
  email: string;

  @Field()
  password: string;
}

@ArgsType()
export class FindUserInput {
  @Field()
  username: string;
}
