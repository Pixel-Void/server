import { Service } from 'typedi';
import DataLoader from 'dataloader';
import { In } from 'typeorm';
import { drop } from 'lodash';

import { Dataloader } from './interfaces/dataloader';
import { batch, batchMany, paginatedBatch } from './batch';

import UserRepository from '~/repositories/user-repository';
import { User } from '~/entity/User';
import { Void } from '~/entity/Void';
import VoidRepository from '~/repositories/void-repository';
import StarRepository from '~/repositories/star-repository';
import { Star } from '~/entity/Star';

export interface GalaxyLoader {
  author: Dataloader;
  void: Dataloader;
  stars: Dataloader;
}

@Service()
export default class GalaxyDataloader {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly voidRepository: VoidRepository,
    private readonly starRepository: StarRepository,
  ) { }

  private get authorLoader() {
    return new DataLoader(async keys => {
      const authorsIds = keys as any[];
      const authors = await this.userRepository.repository.find({
        where: { id: In(authorsIds) },
      });

      return batch<User>(authorsIds, authors, 'id');
    });
  }

  private get voidLoader() {
    return new DataLoader(async keys => {
      const voidsIds = keys as any[];
      const voids = await this.voidRepository.repository.find({
        where: { id: In(voidsIds) },
      });

      return batch<Void>(voidsIds, voids, 'id');
    });
  }

  private get starsLoader() {
    return new DataLoader(async keys => {
      const galaxiesIds = keys as any[];
      const starsIds =
        await paginatedBatch<Star>({ select: 'id', where: ['galaxyId', galaxiesIds], entity: 'stars' });
      const stars = starsIds.length > 0 ? await this.starRepository.repository.find({
        where: {
          id: In(starsIds),
        },
      }) : [];

      return batchMany<Star>(galaxiesIds, stars, 'galaxyId');
    });
  }

  public get loaders(): GalaxyLoader {
    return ({
      author: this.authorLoader,
      void: this.voidLoader,
      stars: this.starsLoader,
    });
  }
}
