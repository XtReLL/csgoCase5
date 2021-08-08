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
    private caseService: CaseService,
  ) // private readonly caseService: CaseService,
  {}

  async openCase(
    box: Case,
    openCaseInput: OpenCaseInput,
  ): Promise<[Item[], number]> {
    const winItems: Item[] = [];
    let price = 0;
    let bank = box.bank;

    for (let i = 0; i < openCaseInput.count; i++) {
      if (box.price > bank) {
        bank = randomInt(bank, box.price);
      }

      const minItem = await this.caseService.getMinItemInCase(box.id);

      if (bank <= 0) {
        bank = (await minItem.item).price;
      }

      const item = await this.caseService.getItemByPrice(
        randomInt((await minItem.item).price, bank),
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
