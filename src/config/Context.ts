import { AuthContext } from '~/auth';
import { LoadersContext } from '~/dataloaders';

export interface AppContext extends AuthContext {
  loaders: LoadersContext;
}
