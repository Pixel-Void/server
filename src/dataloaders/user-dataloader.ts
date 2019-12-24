import DataLoader from 'dataloader';
import { Service } from 'typedi';
import VoidRepository from '~/repositories/void-repository';

@Service()
export default class UserDataloader {
  constructor(
    private readonly voidRepository: VoidRepository,
  ) {}
  private voidLoader() {
    return new DataLoader(async keys => {
      return keys.map(key => key);
    });
  }

  public get loaders() {
    return {
      void: this.voidLoader,
    };
  }
}
