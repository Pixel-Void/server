import { Galaxy } from '~/entity/Galaxy';
import { InputType, Field } from 'type-graphql';

@InputType()
export class CreateGalaxyInput implements Partial<Galaxy> {
  @Field()
  title: string;

  @Field()
  voidId: string;

  @Field({ nullable: true })
  description?: string;
}
