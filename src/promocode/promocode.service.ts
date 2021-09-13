import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthorizedModel } from 'auth/model/authorized.model';
import { defaultPagination, Pagination } from 'list/pagination.input';
import { paramsToBuilder } from 'list/params';
import { RedisCacheService } from 'redisCache/redisCache.service';
import { IsNull, Repository } from 'typeorm';
import { PromocodeType } from 'typings/graphql';
import { User } from 'user/user/entity/user.entity';
import { UserService } from 'user/user/user.service';
import { CreatePromocodeInput } from './dto/create-promocode.input';
import { UpdatePromocodeInput } from './dto/update-promocode.input';
import { PromocodeUse } from './entity/promocode-use.entity';
import { Promocode } from './entity/promocode.entity';

@Injectable()
export class PromocodeService {
  constructor(
    @InjectRepository(Promocode)
    private readonly promocodeRepository: Repository<Promocode>,
    @InjectRepository(PromocodeUse)
    private promocodeUseRepository: Repository<PromocodeUse>,
    private readonly redisCacheService: RedisCacheService,
    private readonly userService: UserService,
  ) {}

  async createPromocode(
    input: CreatePromocodeInput,
    author: AuthorizedModel,
  ): Promise<Promocode> {
    const entity = this.promocodeRepository.create({
      name: input.name,
      sum: input.sum,
      percent: input.percent,
      count: input.count,
      endTime: input.endTime,
    });

    return await this.promocodeRepository.save(entity);
  }

  async updatePromocode(
    input: UpdatePromocodeInput,
    author: AuthorizedModel,
  ): Promise<Promocode> {
    const id = parseInt(input.id, 10);
    const promocode = await this.promocodeRepository.findOneOrFail(id);
    return await this.promocodeRepository.save(
      this.promocodeRepository.merge(promocode, {
        ...input,
        sum: input.sum ? input.sum : null,
        percent: input.percent ? input.percent : null,
        id,
      }),
    );
  }

  async removePromocode(id: string, author: AuthorizedModel): Promise<boolean> {
    const promocode = await this.promocodeRepository.findOneOrFail(
      parseInt(id, 10),
    );
    await this.promocodeRepository.softRemove(promocode);
    return true;
  }

  async usePromocode(user: User, code: string): Promise<any> {
    if (
      typeof (await this.redisCacheService.get(`use_promo_${user.id}`)) !==
      'undefined'
    ) {
      throw new HttpException('There are too many requests, please wait', 400);
    }

    this.redisCacheService.set(`use_promo_${user.id}`, code, { ttl: 1000 });

    if (!(await this.userService.getProfileVisibleSteam(user.steamId))) {
      throw new Error(
        'To use the promo code, you must have a public STEAM profile',
      );
    }

    if (
      (await this.userService.getSteamLevel(user.steamId)) <
      (await this.redisCacheService.get('config')).minSteamLvlForUsePromocode
    ) {
      throw new Error(
        'To use the promo code, you must have STEAM level 2 or higher',
      );
    }

    if (
      (await this.userService.getPlayTimeCSGO(user.steamId)) <
      (await this.redisCacheService.get('config'))
        .minPlayTimeInCSGOForUsePromocode
    ) {
      throw new Error(
        'To use the promo code, you must have at least 30 hours in CS: GO',
      );
    }

    const promocode = await this.promocodeRepository.findOne({
      where: {
        name: code,
      },
    });

    if (!promocode) {
      throw new Error('Promocode not found');
    }

    if (!promocode.sum) {
      throw new Error('Promocode sum not found');
    }

    if (promocode.endTime !== null && promocode.endTime < new Date()) {
      throw new Error('Promocode expires');
    }

    const usedPromocode = await this.getCountUsedPromocodeById(promocode.id);

    if (promocode.count !== null && usedPromocode >= promocode.count) {
      throw new Error('Promocode has ended');
    }

    if (
      await this.promocodeUseRepository.findOne({
        where: {
          promocodeId: promocode.id,
          userId: user.id,
        },
      })
    ) {
      throw new Error('You have already activated this promocode');
    }

    await this.promocodeUseRepository.save(
      this.promocodeUseRepository.create({
        userId: user.id,
        promocodeId: promocode.id,
      }),
    );

    return true;
  }

  async list(
    model: AuthorizedModel,
    pagination: Pagination = defaultPagination,
  ): Promise<[Promocode[], number]> {
    const query = await paramsToBuilder<Promocode>(
      this.promocodeRepository.createQueryBuilder(),
      pagination,
    );

    const result = await query.getManyAndCount();

    return result;
  }

  async findOne(
    author: AuthorizedModel,
    promocodeId: string,
  ): Promise<Promocode> {
    return this.promocodeRepository.findOneOrFail(parseInt(promocodeId, 10));
  }

  async getCountUsedPromocodeById(promoId: number): Promise<number> {
    const usedPromocode = await this.promocodeUseRepository
      .createQueryBuilder()
      .where('promocodeId = :promocodeId', { promocodeId: promoId })
      .select('COUNT(id)', 'count')
      .getRawOne();

    return usedPromocode.count === null ? 0 : usedPromocode.count;
  }
}
