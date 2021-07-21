import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { CreateGameCaseDto } from './dto/createGameCase.dto';
import { GameCase } from './entity/game-case.entity';

@Injectable()
export class GameCaseService {
  constructor(
    @InjectRepository(GameCase)
    private readonly gameCaseRepository: Repository<GameCase>,
  ) {}

  async createGameCase(
    createGameCaseDto: CreateGameCaseDto,
  ): Promise<GameCase> {
    return await this.gameCaseRepository.save(
      this.gameCaseRepository.create({
        caseId: createGameCaseDto.caseId,
        userId: createGameCaseDto.userId,
        winningItemId: createGameCaseDto.itemId,
      }),
    );
  }
}
