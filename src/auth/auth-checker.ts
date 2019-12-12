import { AuthChecker } from 'type-graphql';
import { GraphQLError } from 'graphql';
import Container from 'typedi';
import { AuthContext } from './auth-context';
import AuthService from './auth-service';

export const customAuthChecker: AuthChecker<AuthContext> = async (
  { root, args, context, info },
  roles,
) => {
  if (!context.user) return false;
  // here we can read the user from context
  // and check his permission in the db against the `roles` argument
  // that comes from the `@Authorized` decorator, eg. ["ADMIN", "MODERATOR"]

  const authService = Container.get(AuthService);
  const userExists = await authService.checkUserExist(context.user.id);
  if (!userExists) throw new GraphQLError('Ooops, something went wrong...');

  return true; // or false if access is denied
};
