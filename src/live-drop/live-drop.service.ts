import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { defaultPagination, Pagination } from 'list/pagination.input';
import { paramsToBuilder } from 'list/params';
import { SocketGateway } from 'socket/socket.gateway';
import { createQueryBuilder, Repository } from 'typeorm';
import { LiveDropType } from 'typings/graphql';
import { CreateLiveDropInput } from './dto/createLiveDrop.input';
import { LiveDrop } from './entity/live-drop.entity';

@Injectable()
export class LiveDropService {
  constructor(
    private readonly socketGateway: SocketGateway,
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
        type: createLiveDropInput.type,
      }),
    );
    return entity;
  }

  async getOpenedCases(
    pagination: Pagination = defaultPagination,
  ): Promise<[LiveDrop[], number]> {
    const query = await paramsToBuilder<LiveDrop>(
      await this.liveDropRepository.createQueryBuilder(),
      pagination,
    );
    query.andWhere('type = :type', { type: LiveDropType.CASE });
    return await query.getManyAndCount();
  }

  async updateLiveDrop() {
    await this.socketGateway.socket.emit(
      'updateLiveDrop',
      await this.getOpenedCases(),
    );
  }
}
