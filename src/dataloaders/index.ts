import { Service } from 'typedi';

import UserDataloader, { UserLoader } from './user-dataloader';
import VoidDataloader, { VoidLoader } from './void-dataloader';
import GalaxyDataloader, { GalaxyLoader } from './galaxy-dataloader';

export interface LoadersContext {
  user: UserLoader;
  voids: VoidLoader;
  galaxy: GalaxyLoader;
}

@Service()
export default class Loaders {
  constructor(
    private readonly userLoader: UserDataloader,
    private readonly voidLoader: VoidDataloader,
    private readonly galaxyLoader: GalaxyDataloader,
  ) { }

  public get loaders(): LoadersContext {
    return ({
      user: { ...this.userLoader.loaders },
      voids: { ...this.voidLoader.loaders },
      galaxy: { ...this.galaxyLoader.loaders },
    });
  }
}
