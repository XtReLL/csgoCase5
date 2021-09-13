import { InputType } from '@nestjs/graphql';
import {
  CreateGiveawayInput as CreateGiveawayInputInterface,
  GiveawayType,
} from 'typings/graphql';

@InputType()
export class CreateGiveawayInput implements CreateGiveawayInputInterface {
  itemId!: number;
  endDate?: Date;
  type?: GiveawayType;
}
