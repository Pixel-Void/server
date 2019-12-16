import { ObjectType, Field } from 'type-graphql';

import { User } from '~/entity/User';
import { SearchPayload } from '~/graphql/common/search';
import { UsersVoids } from '~/entity/UsersVoids';

@ObjectType()
export class AllUsersPayload extends SearchPayload(User) {}

@ObjectType()
export class CreateVoidSubscriptionPayload {
  @Field()
  subscription: UsersVoids;
}
