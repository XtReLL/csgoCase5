import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { CaseOpenEvent } from 'game/case/events/case.event';
import { GiveawayService } from './giveaway.service';

@Injectable()
export class GiveawayListener {
  constructor(private readonly giveawayService: GiveawayService) {}

  @OnEvent('case.open')
  async openCase({ box, user }: CaseOpenEvent): Promise<void> {
    const weeklyGiveaway = await this.giveawayService.getWeeklyGiveaway();
    const dailyGiveaway = await this.giveawayService.getDailyGiveaway();
    this.giveawayService.joinToGiveaway(user, weeklyGiveaway.id);
    this.giveawayService.joinToGiveaway(user, dailyGiveaway.id);
  }
}
