import { InputType } from '@nestjs/graphql';
import {
  CaseRarityType,
  CaseStatusType,
  CreateCaseInput as CreateCaseInputInterface,
} from 'typings/graphql';

@InputType()
export class CreateCaseInput implements CreateCaseInputInterface {
  name!: string;
  price?: number;
  rarirty?: CaseRarityType;
  categories!: string[];
  status?: CaseStatusType;
  discount?: number;
  icon?: string;
  bankPercent?: number;
}
