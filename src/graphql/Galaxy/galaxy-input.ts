import { Galaxy } from '~/entity/Galaxy';
import { InputType, Field } from 'type-graphql';
import { SearchInput } from '../common/search';

@InputType()
export class CreateGalaxyInput implements Partial<Galaxy> {
  @Field()
  title: string;

  @Field()
  voidId: string;

  @Field({ nullable: true })
  description?: string;
}

@InputType()
export class SearchGalaxyInput extends SearchInput {
  @Field()
  slug: string;
}
