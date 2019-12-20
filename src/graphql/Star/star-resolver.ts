import { Service } from 'typedi';
import { Resolver, Mutation, Arg, Args } from 'type-graphql';
import { SendStarInput } from './star-input';

import UploadService from '~/services/upload-service';

@Service()
@Resolver()
export class StarResolver {

  constructor(
    private readonly uploadService: UploadService,
  ) { }

  @Mutation(returns => String)
  async submitStar(@Args() { file }: SendStarInput): Promise<string> {
    const { filename, encoding, createReadStream } = await file;
    const stream = createReadStream();

    const { secure_url: url } = await this.uploadService.upload(stream);
    return url;
  }

}
