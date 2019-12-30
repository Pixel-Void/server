import { Service } from 'typedi';
import DataLoader from 'dataloader';
import { In } from 'typeorm';

import { Dataloader } from './interfaces/dataloader';
import { batch } from './batch';

import UserRepository from '~/repositories/user-repository';
import { User } from '~/entity/User';
import { Void } from '~/entity/Void';
import VoidRepository from '~/repositories/void-repository';

export interface GalaxyLoader {
  author: Dataloader;
  void: Dataloader;
}

@Service()
export default class GalaxyDataloader {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly voidRepository: VoidRepository,
  ) {}

  private get authorLoader() {
    return new DataLoader(async keys => {
      const authorsIds = keys as any[];
      const authors = await this.userRepository.repository.find({
        where: { id: In(authorsIds) },
      });

      return batch<User>(authorsIds, authors, ['id']);
    });
  }

  private get voidLoader() {
    return new DataLoader(async keys => {
      const voidsIds = keys as any[];
      const voids = await this.voidRepository.repository.find({
        where: { id: In(voidsIds) },
      });

      return batch<Void>(voidsIds, voids, ['id']);
    });
  }

  public get loaders(): GalaxyLoader {
    return ({
      author: this.authorLoader,
      void: this.voidLoader,
    });
  }
}
