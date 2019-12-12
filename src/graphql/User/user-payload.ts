import { User } from '~/entity/User';
import { ObjectType } from 'type-graphql';
import { SearchPayload } from '~/graphql/common/search';

@ObjectType()
export class AllUsersPayload extends SearchPayload(User) {}
