import { InputType } from '@nestjs/graphql';
import {
  CaseRarityType,
  CaseStatusType,
  AddItemsInCaseInput as AddItemsInCaseInputInterface,
} from 'typings/graphql';

@InputType()
export class AddItemsInCaseInput implements AddItemsInCaseInputInterface {
  caseId!: string;
  itemsId!: string[];
}
