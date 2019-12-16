import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Repository } from 'typeorm';

import { UsersVoids } from '~/entity/UsersVoids';
import UserRepository from './user-repository';
import VoidRepository from './void-repository';
import { CreateVoidSubscriptionInput } from '~/graphql/Subscription/subscription-input';

@Service()
export default class UsersVoidsRepository {
  constructor(
    @InjectRepository(UsersVoids) public readonly repository: Repository<UsersVoids>,
    private readonly userRepository: UserRepository,
    private readonly voidRepository: VoidRepository,
    ) {}

  public async create(payload: CreateVoidSubscriptionInput, userId: string) {
    await this.userRepository.repository.findOneOrFail(userId);
    const voidEntity = await this.voidRepository.repository.findOneOrFail(payload.voidId);

    const subscription = new UsersVoids();
    subscription.userId = userId;
    subscription.voidId = payload.voidId;
    subscription.void = voidEntity;

    await this.repository.save(subscription);
    return subscription;
  }
}
