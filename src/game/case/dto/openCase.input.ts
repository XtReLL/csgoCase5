import { InputType } from '@nestjs/graphql';
import {
  CaseRarityType,
  CaseStatusType,
  OpenCaseInput as OpenCaseInputInterface,
} from 'typings/graphql';

@InputType()
export class OpenCaseInput implements OpenCaseInputInterface {
  id!: string;
  count!: number;
}
