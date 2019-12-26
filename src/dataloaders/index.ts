import { Service } from 'typedi';
import UserDataloader, { UserLoader } from './user-dataloader';

export interface LoadersContext {
  user: UserLoader;
}

@Service()
export default class Loaders {
  constructor(
    private readonly userLoader: UserDataloader,
  ) { }

  public get loaders(): LoadersContext {
    return ({
      user: { ...this.userLoader.loaders },
    });
  }
}
