import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Repository, Like } from 'typeorm';

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
  ) { }

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

  public async paginateAndSearch(
    page: number,
    limit: number,
    query: string | undefined,
    voidId: string,
  ) {
    const offset = (page - 1) * limit;
    const [galaxies, totalCount] = await this.repository.findAndCount({
      take: limit,
      skip: offset,
      where: [
        { title: Like(`%${query}%`), void: { id: voidId } },
      ],
    });

    return { galaxies, totalCount };
  }

  public async findById(galaxyId: string): Promise<Galaxy> {
    const galaxy = await this.repository.findOne(galaxyId);

    if (!galaxy) throw new Error('Failed to find Galaxy');

    return galaxy;
  }

  public async findAndCheckOwnership(galaxyId: string, userId: string): Promise<Galaxy> {
    const galaxy = await this.findById(galaxyId);
    if ((await galaxy.author).id !== userId) throw new Error('Cannot create Star for this Galaxy!');

    return galaxy;
  }
}
