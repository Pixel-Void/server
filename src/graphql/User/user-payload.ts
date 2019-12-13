import { User } from '~/entity/User';
import { ObjectType, Field } from 'type-graphql';
import { SearchPayload } from '~/graphql/common/search';

@ObjectType()
export class AllUsersPayload extends SearchPayload(User) {}

@ObjectType()
export class CreateVoidSubscriptionPayload {
  @Field()
  ok: boolean;
}
