import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Repository, Brackets } from 'typeorm';

import UserRepository from './user-repository';
import VoidRepository from './void-repository';

import { Galaxy } from '~/entity/Galaxy';
import { CreateGalaxyInput } from '~/graphql/Galaxy/galaxy-input';
import { GalaxiesPayload } from '~/graphql/Galaxy/galaxy-payload';
import { SearchInput } from '~/graphql/common/search';

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
    galaxy.void = voidEntity;
    galaxy.title = payload.title;
    payload.description = payload.description;

    await this.repository.save(galaxy);

    return galaxy;
  }

  public async paginateAndSearch(
    { page, limit, query }: SearchInput,
    slug: string,
  ): Promise<GalaxiesPayload> {
    const offset = (page - 1) * limit;

    const [galaxies, totalCount] = await this.repository.createQueryBuilder('galaxy')
      .innerJoin('galaxy.void', 'void', 'void.slug = :slug', { slug })
      .where('galaxy.void = void.id')
      .innerJoin('galaxy.author', 'author')
      .andWhere(new Brackets(qb => {
        qb.where('LOWER(galaxy.title) LIKE LOWER(:query)', { query: `%${query}%` })
          .orWhere('LOWER(author.username) LIKE LOWER(:query)', { query: `%${query}%` });
      }))
      .take(limit)
      .skip(offset)
      .getManyAndCount();

    return { edges: galaxies, totalCount };
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
