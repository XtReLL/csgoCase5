import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { defaultPagination, Pagination } from 'list/pagination.input';
import { paramsToBuilder } from 'list/params';
import { SocketGateway } from 'socket/socket.gateway';
import { createQueryBuilder, MoreThanOrEqual, Repository } from 'typeorm';
import { LiveDropType, RarityLiveDropType } from 'typings/graphql';
import { CreateLiveDropInput } from './dto/createLiveDrop.input';
import { SearchLiveDropInput } from './dto/searchLiveDrop.input';
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
  async getLiveDrop(
    pagination: Pagination = defaultPagination,
    search?: SearchLiveDropInput,
  ): Promise<[LiveDrop[], number]> {
    const query = await paramsToBuilder(
      this.liveDropRepository.createQueryBuilder(),
      pagination,
    );
    console.log(search);

    if (
      search?.liveDropFilters?.liveDropType === RarityLiveDropType.TOP &&
      search.liveDropFilters.priceMoreThan
    ) {
      query.andWhere('price >= :price', {
        price: search.liveDropFilters.priceMoreThan,
      });
    }

    if (search?.caseId) {
      query.andWhere('caseId = :caseId', { caseId: search.caseId });
    }
    return query.getManyAndCount();
  }
}
