import { InputType } from '@nestjs/graphql';
import { CreatePromocodeInput as CreatePromocodeInputInterface } from 'typings/graphql';

@InputType()
export class CreatePromocodeInput implements CreatePromocodeInputInterface {
  name!: string;
  sum?: number;
  percent?: number;
  count?: number;
  endTime?: Date;
  onMainPage?: boolean;
}
