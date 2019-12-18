import { Service } from 'typedi';
import { Resolver, Mutation, Authorized, Arg, Ctx, FieldResolver, Root } from 'type-graphql';
import { Galaxy } from '~/entity/Galaxy';
import GalaxyRepository from '~/repositories/galaxy-repository';
import { CreateGalaxyInput } from './galaxy-input';
import { AuthContext } from '~/auth';
import UserRepository from '~/repositories/user-repository';

@Service()
@Resolver(of => Galaxy)
export class GalaxyResolver {

  constructor(
    private readonly galaxyRepository: GalaxyRepository,
    private readonly userRepository: UserRepository,
  ) { }

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
