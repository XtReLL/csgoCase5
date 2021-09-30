import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { randomInt } from 'crypto';

import { CaseService } from 'game/case/case.service';
import { OpenCaseInput } from 'game/case/dto/openCase.input';
import { Case } from 'game/case/entity/case.entity';
import { Item } from 'item/entity/item.entity';

@Injectable()
export class CasePaybackSystemService {
  constructor(
    @Inject(forwardRef(() => CaseService))
    private caseService: CaseService, // private readonly caseService: CaseService,
  ) {}

  async openCase(
    box: Case,
    openCaseInput: OpenCaseInput,
  ): Promise<[Item[], number]> {
    const winItems: Item[] = [];
    let price = 0;
    let bank = box.bank;

    for (let i = 0; i < openCaseInput.count; i++) {
      if (box.price > bank) {
        bank = Math.floor(Math.random() * (box.price - bank) + bank);
      }
      console.log(bank);

      const minItem = await this.caseService.getMinItemInCase(box.id);
      console.log(minItem);

      if (bank <= 0) {
        bank = (await minItem.item).price;
      }
      console.log('second ', bank);

      const item = await this.caseService.getItemByPrice(
        Math.floor(
          Math.random() * (bank - (await minItem.item).price) +
            (
              await minItem.item
            ).price,
        ),

        box.id,
      );

      const profit =
        box.price * (box.bankPercent / 100) - (await item.item).price;

      price += (await item.item).price;

      box.bank = box.bank + profit;

      winItems.push(await item.item);
    }

    return [winItems, price];
  }
}
