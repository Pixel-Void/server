import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Repository } from 'typeorm';

import { UsersVoids } from '~/entity/UsersVoids';

@Service()
export default class UsersVoidsRepository {
  constructor(@InjectRepository(UsersVoids) public readonly repository: Repository<UsersVoids>) {}
}
