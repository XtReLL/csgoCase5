import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LiveDropType } from 'typings/graphql';
import { CreateLiveDropInput } from './dto/createLiveDrop.input';
import { LiveDrop } from './entity/live-drop.entity';

@Injectable()
export class LiveDropService {
  constructor(
    @InjectRepository(LiveDrop)
    private readonly liveDropRepository: Repository<LiveDrop>,
  ) {}

  async create(createLiveDropInput: CreateLiveDropInput): Promise<LiveDrop> {
    const entity = await this.liveDropRepository.save(
      this.liveDropRepository.create({
        userId: parseInt(createLiveDropInput.userId, 10),
        itemId: parseInt(createLiveDropInput.itemId, 10),
        price: createLiveDropInput.price,
        caseId: createLiveDropInput.caseId
          ? parseInt(createLiveDropInput.caseId, 10)
          : undefined,
        type: LiveDropType.CASE,
      }),
    );
    return entity;
  }
}
