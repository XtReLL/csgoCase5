import { User } from 'user/user/entity/user.entity';
import { Case } from '../entity/case.entity';

export class CaseOpenEvent {
  constructor(public box: Case, public user: User) {}
}
