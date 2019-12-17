import { ObjectType, Field } from 'type-graphql';

@ObjectType()
export class CreateGalaxyPayload {
  @Field()
  ok: boolean;
}
