import { Service } from 'typedi';
import DataLoader from 'dataloader';
import { In } from 'typeorm';

import { batchMany } from './batch';
import { Dataloader } from './interfaces/dataloader';

import GalaxyRepository from '~/repositories/galaxy-repository';
import { Galaxy } from '~/entity/Galaxy';

export interface VoidLoader {
  galaxies: Dataloader;
}

@Service()
export default class VoidDataloader {
  constructor(
    private readonly galaxyRepository: GalaxyRepository,
  ) { }

  private get galaxiesLoader() {
    return new DataLoader(async keys => {
      const voidsIds = keys as any[];
      const galaxies = await this.galaxyRepository.repository.find({
        where: {
          void: { id: In(voidsIds) },
        },
        relations: ['void'],
      });

      return batchMany<Galaxy>(voidsIds, galaxies, ['void', 'id']);
    });
  }

  public get loaders(): VoidLoader {
    return ({
      galaxies: this.galaxiesLoader,
    });
  }
}
