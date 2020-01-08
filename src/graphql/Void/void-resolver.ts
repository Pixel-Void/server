import { Service } from 'typedi';
import { Resolver, Mutation, Arg, Authorized, Query, FieldResolver, Root, Ctx } from 'type-graphql';

import { CreateVoidInput } from './void-input';
import { AllVoidsPayload } from './void-payload';
import { SearchInput } from '../common/search';

import VoidRepository from '~/repositories/void-repository';
import { Void } from '~/entity/Void';
import { AppContext } from '~/config/Context';

@Service()
@Resolver(of => Void)
export class VoidResolver {
  constructor(
    private readonly voidRepository: VoidRepository,
  ) { }

  @Authorized()
  @Mutation(returns => Void)
  async createVoid(
    @Arg('input') createUserData: CreateVoidInput,
  ): Promise<Void> {
    return this.voidRepository.create(createUserData);
  }

  @Query(returns => AllVoidsPayload)
  async allVoids(
    @Arg('input', { nullable: true }) input: SearchInput,
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

  @Query(returns => Void)
  async void(
    @Arg('slug') slug: string,
  ) {
    return this.voidRepository.findOne({ slug });
  }

  /**
   * @todo add pagination + query search
   */
  @FieldResolver()
  async galaxies(@Root() voidEntity: Void, @Ctx() { loaders }: AppContext) {
    return loaders.voids.galaxies.load(voidEntity.id);
  }

}
