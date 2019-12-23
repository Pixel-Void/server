import { Service } from 'typedi';
import { Resolver, Mutation, Args, Authorized, Ctx } from 'type-graphql';

import { SendStarInput } from './star-input';

import UploadService from '~/services/upload-service';
import StarRepository from '~/repositories/star-repository';
import { AuthContext } from '~/auth';
import { Star } from '~/entity/Star';
import GalaxyRepository from '~/repositories/galaxy-repository';

@Service()
@Resolver(of => Star)
export class StarResolver {

  constructor(
    private readonly uploadService: UploadService,
    private readonly starRepository: StarRepository,
    private readonly galaxyRepository: GalaxyRepository,
  ) { }

  @Authorized()
  @Mutation(returns => Star)
  async submitStar(
    @Args() { file, galaxyId }: SendStarInput,
    @Ctx() { user }: AuthContext,
  ): Promise<Star> {
    const { createReadStream } = await file;
    const stream = createReadStream();

    const galaxy = await this.galaxyRepository.findAndCheckOwnership(galaxyId, user.id);
    const uploadData = await this.uploadService.upload(stream);

    return this.starRepository.create({ userId: user.id, galaxy }, uploadData);
  }

}
