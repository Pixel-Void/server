import { InputType, Field, Int } from 'type-graphql';
import { Min } from 'class-validator';

@InputType()
export class SearchInput {
  @Field(type => Int, { nullable: true, defaultValue: 1 })
  @Min(1)
  page: number;

  @Field(type => Int, { nullable: true, defaultValue: 10 })
  limit: number;

  @Field({ nullable: true })
  query?: string;
}
