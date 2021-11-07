import { forwardRef, Inject, Injectable } from '@nestjs/common';

import { TradeService } from 'trade/trade.service';

import { FindOrCreateUserDto } from './dto/findOrCreateUser.dto';
import { User } from './entity/user.entity';
import axios from 'axios';
import { RedisCacheService } from 'redisCache/redisCache.service';
import { ReferallService } from 'user/referall/referall.service';
import { ReferallCode } from 'user/referall/entity/referallCode.entity';
import { AuthorizedModel } from 'auth/model/authorized.model';
import { AuthProviders, SearchUserInput } from 'typings/graphql';
import { defaultPagination, Pagination } from 'list/pagination.input';
import { paramsToBuilder } from 'list/params';
import { UserRepository } from './user.repository';
import { Inventory } from 'inventory/entity/inventory.entity';
import { InventoryService } from 'inventory/inventory.service';
import { UserRole } from './entity/user-role.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './entity/role.entity';
import { Profile } from 'passport';

@Injectable()
export class UserService {
  constructor(
    private userRepository: UserRepository,
    private readonly redisCacheService: RedisCacheService,
    private readonly tradeService: TradeService,
    private readonly referallService: ReferallService,
    @Inject(forwardRef(() => InventoryService))
    private readonly inventoryService: InventoryService,
    @InjectRepository(UserRole)
    private readonly userRoleRepository: Repository<UserRole>,
  ) {}

  async findUserRole(userId: number): Promise<Role> {
    return await (
      await this.userRoleRepository.findOneOrFail({ where: { userId } })
    ).role;
  }

  async isSame(user: User, auth: AuthorizedModel): Promise<boolean> {
    return user.id === auth.model.id || auth.role == 'admin' ? true : false;
  }

  byIds(ids: number[]): Promise<User[]> {
    return this.userRepository.findByIds(ids);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  findOne(id: number): Promise<User> {
    return this.userRepository.findOneOrFail(id);
  }

  async findOrCreate(profile: Profile): Promise<User> {
    let user = await this.findBySocialId(profile.id, profile.provider);

    if (!user) {
      user = await this.userRepository.save(
        this.userRepository.create({
          username: profile.displayName,
          socialId: profile.id,
          avatar: profile.photos ? profile.photos[1].value : '',
          authProvider: profile.provider as AuthProviders,
        }),
      );
      await this.referallService.createReferallCode(user);
    } else {
      user.username = profile.displayName;
      user.avatar = profile.photos ? profile.photos[1].value : '';
    }

    return await this.update(user);
  }

  async findBySocialId(socialId: string, authProvider: string): Promise<User> {
    let user = await this.redisCacheService.get(
      `user__${authProvider}_${socialId}`,
    );

    if (user) {
      return user;
    }

    user = await this.userRepository.findOne({
      where: {
        socialId: socialId,
        authProvider: authProvider,
      },
    });

    if (user) {
      return await this.update(user);
    } else {
      return user;
    }
  }

  async update(user: User): Promise<User> {
    user = await this.userRepository.save(user, { transaction: true });
    await this.redisCacheService.set(
      `user_${user.authProvider}_${user.socialId}`,
      user,
    );
    return user;
  }

  async setTradeUrl(user: User, tradeUrl: string): Promise<boolean> {
    try {
      const data = tradeUrl.split('?')[1];

      if (data) {
        if (data.indexOf('partner') > -1 && data.indexOf('token') > -1) {
          const offer =
            this.tradeService.tradeOfferManager.createOffer(tradeUrl);

          if (offer.partner.getSteamID64() !== user.socialId) {
            throw new Error('This is not your trade link');
          }

          user.tradeUrl = tradeUrl;
          await this.update(user);

          return true;
        }

        throw new Error('Invalid trade link');
      }

      return false;
    } catch (e) {
      throw new Error(`Error setTradeUrl ==> ${e}`);
    }
  }

  async getPlayTimeCSGO(steamId: number): Promise<number> {
    try {
      const response = await axios.get(
        `http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${process.env.STEAM_APIKEY}&steamid=${steamId}&format=json`,
      );
      const games = response.data['response']['games'];

      let playedTime = 0;

      games.map((game: any) => {
        if (game.appid === 730) {
          playedTime = game.playtime_forever / 60;
        }
      });

      return playedTime;
    } catch (e) {
      return 0;
    }
  }

  async getProfileVisibleSteam(steamId: number): Promise<boolean> {
    try {
      const response = await axios.get(
        `http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${process.env.STEAM_APIKEY}&steamids=${steamId}`,
      );
      const data = response.data['response']['players'][0];

      let visible = false;

      if (data['communityvisibilitystate'] === 3) {
        visible = true;
      }

      return visible;
    } catch (e) {
      return false;
    }
  }

  async getSteamLevel(steamId: number): Promise<number> {
    try {
      const response = await axios.get(
        `http://api.steampowered.com/IPlayerService/GetSteamLevel/v1/?key=${process.env.STEAM_APIKEY}&steamid=${steamId}`,
      );
      const data = response.data['response'];

      return data.player_level;
    } catch (e) {
      return 0;
    }
  }

  async getUserReferallCode(user: User): Promise<ReferallCode> {
    return await this.referallService.findByUser(user.id);
  }

  async getUserInventory(
    user: User,
    pagination?: Pagination,
  ): Promise<[Inventory[], number]> {
    return await this.inventoryService.list(user.id, pagination);
  }

  async list(
    search?: SearchUserInput,
    pagination: Pagination = defaultPagination,
  ): Promise<[User[], number]> {
    const query = await paramsToBuilder(
      this.userRepository.createQueryBuilder(),
      pagination,
    );
    const result = query
      // .processSearchInput(query, search)
      .getManyAndCount();
    return result;
  }

  async getTopList(): Promise<User[]> {
    return await this.userRepository
      .createQueryBuilder()
      .limit(10)
      .orderBy('profit', 'DESC')
      .getMany();
  }
}
