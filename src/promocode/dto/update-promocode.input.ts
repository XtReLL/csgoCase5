import { InputType } from '@nestjs/graphql';
import { UpdatePromocodeInput as UpdatePromocodeInputInterface } from 'typings/graphql';

@InputType()
export class UpdatePromocodeInput implements UpdatePromocodeInputInterface {
  id!: string;
  name?: string;
  sum?: number;
  percent?: number;
  count?: number;
  endTime?: Date;
}
