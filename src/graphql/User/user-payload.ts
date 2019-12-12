import { User } from '~/entity/User';
import { Field, ObjectType, Int } from 'type-graphql';
import { SearchPayload } from '~/graphql/common/search';

@ObjectType()
export class AllUsersPayload extends SearchPayload(User) {}
