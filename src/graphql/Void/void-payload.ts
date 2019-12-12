import { Void } from '~/entity/Void';
import { ObjectType } from 'type-graphql';
import { SearchPayload } from '~/graphql/common/search';

@ObjectType()
export class AllVoidsPayload extends SearchPayload(Void) {}
