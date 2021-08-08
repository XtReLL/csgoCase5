import { InputType } from '@nestjs/graphql';
import {
  CaseRarityType,
  CaseStatusType,
  UpdateCaseInput as UpdateCaseInputInterface,
} from 'typings/graphql';

@InputType()
export class UpdateCaseInput implements UpdateCaseInputInterface {
  id!: string;
  name?: string;
  price?: number;
  rarirty?: CaseRarityType;
  category?: string;
  status?: CaseStatusType;
  discount?: number;
  icon?: string;
  bankPercent?: number;
}
