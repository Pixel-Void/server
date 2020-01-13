import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { Role } from '~/entity/Role';
import { InjectRepository } from 'typeorm-typedi-extensions';

@Service()
export default class RoleRepository {
  constructor(@InjectRepository(Role) public readonly repository: Repository<Role>) {}
}
