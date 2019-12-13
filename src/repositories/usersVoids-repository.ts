import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Repository } from 'typeorm';

import { UsersVoids } from '~/entity/UsersVoids';
import { CreateVoidSubscriptionInput } from '~/graphql/User/user-input';

@Service()
export default class UsersVoidsRepository {
  constructor(@InjectRepository(UsersVoids) public readonly repository: Repository<UsersVoids>) {}

  public async create(payload: CreateVoidSubscriptionInput, userId: string) {
    const subscription = new UsersVoids();
    subscription.userId = userId;
    subscription.voidId = payload.voidId;

    return this.repository.save(subscription);
  }
}
