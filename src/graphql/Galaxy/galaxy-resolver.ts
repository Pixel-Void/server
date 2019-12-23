import { Service } from 'typedi';
import { Resolver, Mutation, Authorized, Arg, Ctx, FieldResolver, Root, Query } from 'type-graphql';
import { Galaxy } from '~/entity/Galaxy';
import GalaxyRepository from '~/repositories/galaxy-repository';
import { CreateGalaxyInput, SearchGalaxyInput } from './galaxy-input';
import { AuthContext } from '~/auth';
import { GalaxiesPayload } from './galaxy-payload';

@Service()
@Resolver(of => Galaxy)
export class GalaxyResolver {

  constructor(
    private readonly galaxyRepository: GalaxyRepository,
  ) { }

  @Query(returns => GalaxiesPayload)
  async galaxies(
    @Arg('input')
    input: SearchGalaxyInput,
  ): Promise<GalaxiesPayload | undefined> {
    const { galaxies, totalCount } = await this.galaxyRepository.paginateAndSearch(
      input.page,
      input.limit,
      input.query || '',
      input.voidId,
    );

    return {
      edges: galaxies,
      totalCount,
    };
  }

  @Authorized()
  @Mutation(returns => Galaxy)
  async createGalaxy(
    @Arg('input') createGalaxyData: CreateGalaxyInput,
    @Ctx() { user }: AuthContext,
  ): Promise<Galaxy> {
    return this.galaxyRepository.create(createGalaxyData, user.id);
  }

  @FieldResolver()
  async author(@Root() galaxy: Galaxy) {
    return await galaxy.author;
  }

  @FieldResolver()
  async void(@Root() galaxy: Galaxy) {
    return await galaxy.void;
  }
}
