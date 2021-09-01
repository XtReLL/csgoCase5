import { Factory } from 'typeorm-factory';
import { CaseItems } from '../entity/caseItems.entity';

export const CaseItemsFactory = () => new Factory(CaseItems);
