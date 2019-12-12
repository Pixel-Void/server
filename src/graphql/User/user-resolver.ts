import { Resolver, Query, Mutation, Arg, Ctx, Authorized, Args } from 'type-graphql';
import { Service } from 'typedi';
import { CreateUserInput, LoginInput } from './user-input';

import { AuthService, LoginPayload, AuthContext } from '~/auth/';
import { User } from '~/entity/User';
import { AllUsersPayload } from './user-payload';
import UserRepository from '~/repositories/user-repository';
import { SearchInput } from '~/graphql/common/search';

@Service()
@Resolver(of => User)
export class UserResolver {
  constructor(
    private readonly userRepository: UserRepository,
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
}
