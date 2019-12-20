import { ArgsType, Field } from 'type-graphql';
import { GraphQLUpload, FileUpload } from 'graphql-upload';

@ArgsType()
export class SendStarInput {
  @Field(type => GraphQLUpload)
  file: FileUpload;

  @Field()
  galaxyId: string;
}
