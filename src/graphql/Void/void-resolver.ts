import { Service } from 'typedi';
import { Resolver, Mutation, Arg } from 'type-graphql';
import { Void } from '~/entity/Void';
import { CreateVoidInput } from './void-input';
import VoidRepository from '~/repositories/void-repository';
import AuthService from '~/auth/auth-service';

@Service()
@Resolver(of => Void)
export class VoidResolver {
  constructor(
    private readonly voidRepository: VoidRepository,
    private readonly authService: AuthService,
  ) {}

  @Mutation(returns => Void)
  async createVoid(
    @Arg('input') createUserData: CreateVoidInput,
  ): Promise<Void> {
    return this.voidRepository.create(createUserData);
  }

}
