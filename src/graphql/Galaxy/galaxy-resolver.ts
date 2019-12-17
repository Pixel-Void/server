import { Service } from 'typedi';
import { Resolver, Mutation, Authorized, Arg, Ctx } from 'type-graphql';
import { Galaxy } from '~/entity/Galaxy';
import GalaxyRepository from '~/repositories/galaxy-repository';
import { CreateGalaxyInput } from './galaxy-input';
import { AuthContext } from '~/auth';

@Service()
@Resolver(of => Galaxy)
export class GalaxyResolver {

  constructor(
    private readonly galaxyRepository: GalaxyRepository,
  ) { }

  @Authorized()
  @Mutation(returns => Galaxy)
  async createGalaxy(
    @Arg('input') createGalaxyData: CreateGalaxyInput,
    @Ctx() { user }: AuthContext,
  ): Promise<Galaxy> {
    return this.galaxyRepository.create(createGalaxyData, user.id);
  }
}
