import { User } from 'user/user/entity/user.entity';

export interface AuthorizedModel {
  role: string | 'client';
  model: User;
}
