import { Service } from 'typedi';
import { Resolver, Mutation, Arg, Authorized, Query } from 'type-graphql';

import { Void } from '~/entity/Void';
import { CreateVoidInput } from './void-input';
import VoidRepository from '~/repositories/void-repository';
import { AllVoidsPayload } from './void-payload';
import { SearchInput } from '../common/search';

@Service()
@Resolver(of => Void)
export class VoidResolver {
  constructor(
    private readonly voidRepository: VoidRepository,
  ) {}

  @Authorized()
  @Mutation(returns => Void)
  async createVoid(
    @Arg('input') createUserData: CreateVoidInput,
  ): Promise<Void> {
    return this.voidRepository.create(createUserData);
  }

  @Authorized()
  @Query(returns => AllVoidsPayload)
  async allVoids(
    @Arg('input', {nullable: true}) input: SearchInput,
  ) {
    const { voids, totalCount } = await this.voidRepository.paginateAndSearch(
      input.page,
      input.limit,
      input.query || '',
    );
    return {
      edges: voids,
      totalCount,
    };
  }

}
