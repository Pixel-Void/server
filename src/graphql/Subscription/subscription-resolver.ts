import { Service } from 'typedi';
import { Resolver, Authorized, Mutation, Args, Ctx } from 'type-graphql';

import { UsersVoids } from '~/entity/UsersVoids';
import { AuthContext } from '~/auth';
import UsersVoidsRepository from '~/repositories/usersVoids-repository';

import { CreateVoidSubscriptionPayload } from './subscription-payload';
import { CreateVoidSubscriptionInput } from './subscription-input';

@Service()
@Resolver(of => UsersVoids)
export class SubscriptionResolver {
  constructor(
    private readonly usersVoidsRepository: UsersVoidsRepository,
  ) { }

  @Authorized()
  @Mutation(returns => CreateVoidSubscriptionPayload)
  async createVoidSubscription(
    @Args() createData: CreateVoidSubscriptionInput,
    @Ctx() { user }: AuthContext,
  ): Promise<CreateVoidSubscriptionPayload> {
    try {
      const createdSubscription = await this.usersVoidsRepository.create(createData, user.id);

      return { subscription: createdSubscription };
    } catch {
      throw new Error('Failed to create subscription');
    }
  }
}
