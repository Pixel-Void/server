import DataLoader from 'dataloader';
import { Service } from 'typedi';
import UsersVoidsRepository from '~/repositories/usersVoids-repository';
import { In } from 'typeorm';
import { batchMany } from './batch';
import { UsersVoids } from '~/entity/UsersVoids';
import { Dataloader } from './interfaces/dataloader';

export interface UserLoader {
  voidSubscription: Dataloader;
}
@Service()
export default class UserDataloader {
  constructor(
    private readonly usersVoidsRepository: UsersVoidsRepository,
  ) { }

  private get voidSubscriptionLoader() {
    return new DataLoader(async keys => {
      const usersIds = keys as any[];
      const voids = await this.usersVoidsRepository.repository.find({ where: { userId: In(usersIds) }, relations: ['void'] });

      const voidsMap = batchMany<UsersVoids>(usersIds, voids, 'userId');

      return usersIds.map(key => voidsMap[key]);
    });
  }

  public get loaders(): UserLoader {
    return {
      voidSubscription: this.voidSubscriptionLoader,
    };
  }
}
