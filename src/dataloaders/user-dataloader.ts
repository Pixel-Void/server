import DataLoader from 'dataloader';
import { Service } from 'typedi';
import { In } from 'typeorm';

import { batchMany, batch } from './batch';
import { Dataloader } from './interfaces/dataloader';

import { UsersVoids } from '~/entity/UsersVoids';
import UsersVoidsRepository from '~/repositories/usersVoids-repository';
import { Role } from '~/entity/Role';
import RoleRepository from '~/repositories/role-repository';

export interface UserLoader {
  voidSubscription: Dataloader;
  role: DataLoader<string, Role>;
}
@Service()
export default class UserDataloader {
  constructor(
    private readonly usersVoidsRepository: UsersVoidsRepository,
    private readonly roleRepository: RoleRepository,
  ) { }

  private get voidSubscriptionLoader() {
    return new DataLoader(async keys => {
      const usersIds = keys as any[];
      const voids = await this.usersVoidsRepository.repository.find({
        where: { userId: In(usersIds) }, relations: ['void'],
      });

      return batchMany<UsersVoids>(usersIds, voids, 'userId');
    });
  }

  private get roleLoader(): DataLoader<string, Role> {
    return new DataLoader(async keys => {
      const roles = await this.roleRepository.repository.find({
        where: {
          id: In(keys as string[]),
        },
      });

      return batch<Role>(keys as string[], roles, 'id');
    });
  }

  public get loaders(): UserLoader {
    return {
      voidSubscription: this.voidSubscriptionLoader,
      role: this.roleLoader,
    };
  }
}
