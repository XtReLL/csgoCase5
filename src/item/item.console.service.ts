import { Injectable } from '@nestjs/common';
import { ConsoleService, createSpinner } from 'nestjs-console';
import { ItemService } from './item.service';

@Injectable()
export class ItemConsoleService {
  constructor(
    private readonly consoleService: ConsoleService,
    private readonly itemService: ItemService,
  ) {
    const cli = this.consoleService.getCli();

    this.consoleService.createCommand(
      {
        command: 'item:importItem',
        description: 'Import items',
      },
      () => this.import(),
      cli!,
    );
  }

  async import(): Promise<void> {
    const spin = createSpinner();
    spin.start('Begin import');
    await this.itemService.checkItems();
    spin.succeed('End import');
  }
}
