import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { MongoRepository } from 'typeorm';

import { Void } from '~/entity/Void';
import { CreateVoidInput } from '~/graphql/Void/void-input';
import { GraphQLError } from 'graphql';

@Service()
export default class VoidRepository {
  constructor(
    @InjectRepository(Void) public readonly repository: MongoRepository<Void>,
  ) {}

  public async create(payload: CreateVoidInput) {
    const voidAlreadyExists = await this.repository.findOne({
      where: { name: payload.name },
    });

    if (!!voidAlreadyExists) throw new GraphQLError('Void already exists!');

    const voidRealm = this.repository.create(payload);
    return this.repository.save(voidRealm);
  }

  public async paginateAndSearch(
    page: number,
    limit: number,
    query: string | undefined,
  ) {
    const offset = (page - 1) * limit;
    const [voids, totalCount] = await this.repository.findAndCount({
      take: limit,
      skip: offset,
      where: {
        $or: [
          { name: { $regex: `${query}` } },
          { slug: { $regex: `${query}` } },
        ],
      },
    });

    return { voids, totalCount };
  }
}
