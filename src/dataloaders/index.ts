import { Service } from 'typedi';

import GalaxyDataloader, { GalaxyLoader } from './galaxy-dataloader';
import UserDataloader, { UserLoader } from './user-dataloader';
import VoidDataloader, { VoidLoader } from './void-dataloader';

export interface LoadersContext {
  galaxy: GalaxyLoader;
  user: UserLoader;
  void: VoidLoader;
}

@Service()
export default class Loaders {
  constructor(
    private readonly galaxyLoader: GalaxyDataloader,
    private readonly userLoader: UserDataloader,
    private readonly voidLoader: VoidDataloader,
  ) { }

  public get loaders(): LoadersContext {
    return ({
      galaxy: { ...this.galaxyLoader.loaders },
      user: { ...this.userLoader.loaders },
      void: { ...this.voidLoader.loaders },
    });
  }
}
