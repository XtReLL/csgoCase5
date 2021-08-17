import { User } from 'user/user/entity/user.entity';
import { AuthorizedModel } from '../model/authorized.model';

export const AuthorizedFactory = (
  model: User,
  role: AuthorizedModel['role'] = 'client',
): AuthorizedModel => ({
  model,
  role,
});
