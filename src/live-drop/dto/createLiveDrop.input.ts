import { InputType } from '@nestjs/graphql';
import { CreateLiveDropInput as CreateLiveDropInputInterface } from 'typings/graphql';

@InputType()
export class CreateLiveDropInput implements CreateLiveDropInputInterface {
  userId!: string;
  caseId?: string;
  itemId!: string;
  price!: number;
}
