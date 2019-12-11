import { InputType, Field } from 'type-graphql';
import { MinLength, MaxLength } from 'class-validator';
import { Void } from '~/entity/Void';

@InputType()
export class CreateVoidInput implements Partial<Void> {

  @Field()
  @MinLength(5)
  @MaxLength(32)
  name: string;

  @Field()
  nsfw: boolean;

}
