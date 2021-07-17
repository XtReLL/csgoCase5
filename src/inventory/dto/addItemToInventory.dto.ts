import { IsNotEmpty } from 'class-validator';

export class AddItemToInventoryDto {
  @IsNotEmpty()
  userId!: number;

  @IsNotEmpty()
  itemId!: number;

  @IsNotEmpty()
  price?: number;
}
