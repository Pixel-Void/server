import { Service } from 'typedi';
import UserDataloader from './user-dataloader';

@Service()
export default class Loaders {
  constructor(
    private readonly userLoader: UserDataloader,
  ) { }

  public get loaders() {
    return ({
      user: { ...this.userLoader.loaders },
    });
  }
}
