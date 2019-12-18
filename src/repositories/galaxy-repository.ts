import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Repository } from 'typeorm';

import { Galaxy } from '~/entity/Galaxy';
import { CreateGalaxyInput } from '~/graphql/Galaxy/galaxy-input';
import UserRepository from './user-repository';
import VoidRepository from './void-repository';

@Service()
export default class GalaxyRepository {
  constructor(
    @InjectRepository(Galaxy) public readonly repository: Repository<Galaxy>,
    private readonly userRepository: UserRepository,
    private readonly voidRepository: VoidRepository,
  ) {}

  public async create(payload: CreateGalaxyInput, userId: string): Promise<Galaxy> {
    const user = await this.userRepository.repository.findOne(userId);
    const voidEntity = await this.voidRepository.repository.findOne(payload.voidId);

    if (!user || !voidEntity) throw new Error('Failed to create Galaxy');

    const galaxy = new Galaxy();
    galaxy.author = Promise.resolve(user);
    galaxy.void = Promise.resolve(voidEntity);
    galaxy.title = payload.title;
    payload.description = payload.description;

    await this.repository.save(galaxy);

    return galaxy;
  }
}
