import { Factory } from 'typeorm-factory';
import { User } from 'user/user/entity/user.entity';

export const UserFactory = () => new Factory(User).attr('username', 'TestUser');
