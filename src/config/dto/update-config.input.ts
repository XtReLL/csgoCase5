import { InputType } from '@nestjs/graphql';
import { UpdateConfigInput as UpdateConfigInputInterface } from 'typings/graphql';

@InputType()
export class UpdateConfigInput implements UpdateConfigInputInterface {
  id!: string;
  dollarRate?: number;
  minSteamLvlForUsePromocode?: number;
  minPlayTimeInCSGOForUsePromocode?: number;
}
