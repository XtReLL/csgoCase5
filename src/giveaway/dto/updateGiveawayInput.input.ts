import { InputType } from '@nestjs/graphql';
import { UpdateGiveawayInput as UpdateGiveawayInputInterface } from 'typings/graphql';

@InputType()
export class UpdateGiveawayInput implements UpdateGiveawayInputInterface {
  id!: string;
  itemId?: number;
  endDate?: Date;
}
