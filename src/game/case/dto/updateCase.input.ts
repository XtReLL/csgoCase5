import { InputType } from '@nestjs/graphql';
import {
  CaseRarityType,
  CaseStatusType,
  UpdateCaseInput as UpdateCaseInputInterface,
} from 'typings/graphql';

@InputType()
export class UpdateCaseInput implements UpdateCaseInputInterface {
  id!: string;
  categories?: string[];
  name?: string;
  price?: number;
  rarirty?: CaseRarityType;
  status?: CaseStatusType;
  discount?: number;
  icon?: string;
  bankPercent?: number;
}
