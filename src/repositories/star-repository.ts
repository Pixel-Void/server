import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Repository } from 'typeorm';

import { Star } from '~/entity/Star';
import { Upload } from '~/services/upload-service';

import UserRepository from './user-repository';
import GalaxyRepository from './galaxy-repository';
import { Galaxy } from '~/entity/Galaxy';

@Service()
export default class StarRepository {
  constructor(
    @InjectRepository(Star) public readonly repository: Repository<Star>,
    private readonly userRepository: UserRepository,
    private readonly galaxyRepository: GalaxyRepository,
  ) { }

  public async create({ userId, galaxy }: { userId: string, galaxy: Galaxy }, uploadData: Upload) {
    const user = await this.userRepository.repository.findOne(userId);

    if (!user || !galaxy) throw new Error('Failed to create Star');

    const star = new Star();
    star.author = Promise.resolve(user);
    star.galaxy = Promise.resolve(galaxy);
    star.secureUrl = uploadData.secure_url;
    star.url = uploadData.url;
    star.height = uploadData.height;
    star.width = uploadData.width;
    star.format = uploadData.format;

    await this.repository.save(star);

    return star;
  }
}
