import { Resolver, Query, Mutation, Arg, Ctx, Authorized, Args, FieldResolver, Root } from 'type-graphql';
import { Service } from 'typedi';

import { CreateUserInput, LoginInput, FindUserInput } from './user-input';
import { AllUsersPayload } from './user-payload';
import { AuthService, LoginPayload, AuthContext } from '~/auth/';
import { User } from '~/entity/User';
import UserRepository from '~/repositories/user-repository';
import UsersVoidsRepository from '~/repositories/usersVoids-repository';
import { SearchInput } from '~/graphql/common/search';
import { AppContext } from '~/config/Context';

@Service()
@Resolver(of => User)
export class UserResolver {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly usersVoidsRepository: UsersVoidsRepository,
    private readonly authService: AuthService,
  ) { }

  @Authorized()
  @Query(returns => AllUsersPayload)
  async allUsers(
    @Arg('input', { nullable: true })
    input: SearchInput,
  ): Promise<AllUsersPayload | undefined> {
    const { users, totalCount } = await this.userRepository.paginateAndSearch(
      input.page,
      input.limit,
      input.query || '',
    );
    return {
      edges: users,
      totalCount,
    };
  }

  @Authorized()
  @Query(returns => User)
  async me(@Ctx() { user }: AuthContext): Promise<User> {
    return this.userRepository.repository.findOneOrFail(user.id);
  }

  @Query(returns => User)
  async user(@Args() findData: FindUserInput): Promise<User> {
    return this.userRepository.findByUsername(findData.username);
  }

  @Mutation(returns => LoginPayload)
  async login(@Args() loginData: LoginInput): Promise<LoginPayload> {
    return this.authService.authenticate(loginData.email, loginData.password);
  }

  @Mutation(returns => User)
  async createUser(
    @Arg('input') createUserData: CreateUserInput,
  ): Promise<User> {
    return this.userRepository.create(createUserData);
  }

  @FieldResolver()
  async voids(@Root() user: User, @Ctx() { loaders }: AppContext) {
    return loaders.user.voidSubscription.load(user.id);
  }
}
