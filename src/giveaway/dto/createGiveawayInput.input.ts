import { InputType } from '@nestjs/graphql';
import { CreateGiveawayInput as CreateGiveawayInputInterface } from 'typings/graphql';

@InputType()
export class CreateGiveawayInput implements CreateGiveawayInputInterface {
  itemId!: string;
  endDate?: Date;
}
