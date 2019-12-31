import DataLoader from 'dataloader';
import { Service } from 'typedi';
import { In } from 'typeorm';

import { batchMany } from './batch';
import { Dataloader } from './interfaces/dataloader';

import { UsersVoids } from '~/entity/UsersVoids';
import UsersVoidsRepository from '~/repositories/usersVoids-repository';

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
      const voids = await this.usersVoidsRepository.repository.find({
        where: { userId: In(usersIds) }, relations: ['void'],
      });

      return batchMany<UsersVoids>(usersIds, voids, ['userId']);
    });
  }

  public get loaders(): UserLoader {
    return {
      voidSubscription: this.voidSubscriptionLoader,
    };
  }
}
