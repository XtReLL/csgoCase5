import { Case } from 'case/entity/case.entity';

import { Factory } from 'typeorm-factory';

export const CaseFactory = () => new Factory(Case).attr('name', 'TestCase');
