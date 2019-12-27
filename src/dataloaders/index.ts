import { Service } from 'typedi';

import UserDataloader, { UserLoader } from './user-dataloader';
import VoidDataloader, { VoidLoader } from './void-dataloader';

export interface LoadersContext {
  user: UserLoader;
  voids: VoidLoader;
}

@Service()
export default class Loaders {
  constructor(
    private readonly userLoader: UserDataloader,
    private readonly voidLoader: VoidDataloader,
  ) { }

  public get loaders(): LoadersContext {
    return ({
      user: { ...this.userLoader.loaders },
      voids: { ...this.voidLoader.loaders },
    });
  }
}
