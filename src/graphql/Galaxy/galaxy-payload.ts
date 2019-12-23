import { ObjectType, Field } from 'type-graphql';
import { SearchPayload } from '../common/search';
import { Galaxy } from '~/entity/Galaxy';

@ObjectType()
export class CreateGalaxyPayload {
  @Field()
  ok: boolean;
}

@ObjectType()
export class GalaxiesPayload extends SearchPayload(Galaxy) {}
