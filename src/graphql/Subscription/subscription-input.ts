import { ArgsType, Field } from 'type-graphql';

@ArgsType()
export class CreateVoidSubscriptionInput {
  @Field()
  voidId: string;
}
