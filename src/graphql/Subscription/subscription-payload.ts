import { ObjectType, Field } from 'type-graphql';
import { UsersVoids } from '~/entity/UsersVoids';

@ObjectType()
export class CreateVoidSubscriptionPayload {
  @Field()
  subscription: UsersVoids;
}
