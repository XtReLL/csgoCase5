import { InputType } from '@nestjs/graphql';
import {
  CaseRarityType,
  CaseStatusType,
  CaseSearchInput as CaseSearchInputInterface,
} from 'typings/graphql';

@InputType()
export class CaseSearchInput implements CaseSearchInputInterface {
  status?: CaseStatusType;
  casePriceEnd?: number;
  casePriceStart?: number;
}
