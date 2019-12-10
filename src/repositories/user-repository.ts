import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { MongoRepository } from 'typeorm';

import { User } from '~/entity/User';
import { GraphQLError } from 'graphql';
import { CreateUserInput } from '~/graphql/User/user-input';

@Service()
export default class UserRepository {
  constructor(
    @InjectRepository(User) public readonly repository: MongoRepository<User>,
  ) {}

  public async paginateAndSearch(
    page: number,
    limit: number,
    query: string | undefined,
  ) {
    const offset = (page - 1) * limit;
    const [users, totalCount] = await this.repository.findAndCount({
      take: limit,
      skip: offset,
      where: {
        $or: [
          { email: { $regex: `${query}` } },
          { username: { $regex: `${query}` } },
        ],
      },
    });

    return { users, totalCount };
  }

  public async create(payload: CreateUserInput) {
    const userAlreadyExists = await this.repository.findOne({
      where: { email: payload.email, username: payload.username },
    });

    if (!!userAlreadyExists) throw new GraphQLError('User already exists!');

    const user = this.repository.create(payload);
    return this.repository.save(user);
  }
}
