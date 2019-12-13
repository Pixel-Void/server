import { Resolver, Query, Mutation, Arg, Ctx, Authorized, Args, FieldResolver, Root } from 'type-graphql';
import { Service } from 'typedi';

import { CreateUserInput, LoginInput, CreateVoidSubscriptionInput } from './user-input';
import { AllUsersPayload, CreateVoidSubscriptionPayload } from './user-payload';
import { AuthService, LoginPayload, AuthContext } from '~/auth/';
import { User } from '~/entity/User';
import UserRepository from '~/repositories/user-repository';
import UsersVoidsRepository from '~/repositories/usersVoids-repository';
import { SearchInput } from '~/graphql/common/search';

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
  async me(@Ctx() { user }: AuthContext) {
    return this.userRepository.repository.findOneOrFail(user.id);
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

  @Mutation(returns => CreateVoidSubscriptionPayload)
  async createVoidSubscription(
    @Args() createData: CreateVoidSubscriptionInput,
    @Ctx() { user }: AuthContext,
  ): Promise<CreateVoidSubscriptionPayload> {
    const createdSubscription = await this.usersVoidsRepository.create(createData, user.id);

    return { ok: !!createdSubscription };
  }

  @FieldResolver()
  async voids(@Root() user: User) {
    const findVoids = await this.usersVoidsRepository.repository.find({
      where: { userId: user.id }, relations: ['void'],
    });
    return findVoids;
  }
}
