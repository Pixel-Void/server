import { Service } from 'typedi';
import { Resolver, Mutation, Authorized, Arg, Ctx, FieldResolver, Root, Query } from 'type-graphql';
import { Galaxy } from '~/entity/Galaxy';
import GalaxyRepository from '~/repositories/galaxy-repository';
import { CreateGalaxyInput, SearchGalaxyInput } from './galaxy-input';
import { AuthContext } from '~/auth';
import { GalaxiesPayload } from './galaxy-payload';
import { AppContext } from '~/config/Context';

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
    const { edges, totalCount } = await this.galaxyRepository.paginateAndSearch(
      input,
      input.slug,
    );

    return {
      edges,
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
  async author(@Root() galaxy: Galaxy, @Ctx() { loaders }: AppContext) {
    return loaders.galaxy.author.load(galaxy.authorId);
  }

  @FieldResolver()
  async void(@Root() galaxy: Galaxy, @Ctx() { loaders }: AppContext) {
    return loaders.galaxy.void.load(galaxy.voidId);
  }

  @FieldResolver()
  async stars(@Root() galaxy: Galaxy, @Ctx() { loaders }: AppContext, @Arg('take') take: number) {
    const rows = await loaders.galaxy.starsIds.load({id: galaxy.id, take});
    return rows ? rows.map(row => loaders.galaxy.stars.load(row.id)) : [];
  }
}
