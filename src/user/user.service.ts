import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RedisClientService } from 'redis-client/redis-client.service';
import { TradeService } from 'trade/trade.service';
import { Repository } from 'typeorm';
import { FindOrCreateUserDto } from './dto/findOrCreateUser.dto';
import { User } from './entity/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly redisClientService: RedisClientService,
    private readonly tradeService: TradeService
  ) { }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOrCreate(profile: FindOrCreateUserDto): Promise<User> {
    let user = await this.findBySteamId(profile.steamid)

    if (!user) {
        user = await this.userRepository.create({
            username: profile.personaname,
            steamId: profile.steamid,
            avatar: profile.avatarfull,
        })
    } else {
        user.username = profile.personaname
        user.steamId = profile.steamid
        user.avatar = profile.avatarfull
    }

    return await this.update(user)
  }

  async findBySteamId(steamId: string): Promise<User> {
    let user = await this.redisClientService.get(`user_${steamId}`)

    if (user) {
        return user
    }

    user = await this.userRepository.findOne({
      where: {
          steamId
      }
    })

    if (user) {
        return await this.update(user)
    } else {
        return user
    }
  }

  async update(user: User): Promise<User> {
    user = await this.userRepository.save(user)
    await this.redisClientService.set(`user_${user.steamId}`, user)
    return user
  }

  async setTradeUrl(user: User, tradeUrl: string): Promise<boolean> {
    try {
        const data = tradeUrl.split('?')[1]

        if (data) {
            if (data.indexOf('partner') > -1 && data.indexOf('token') > -1) {
                const offer = this.tradeService.tradeOfferManager.createOffer(tradeUrl)

                if (offer.partner.getSteamID64() !== user.steamId) {
                    throw new Error("This is not your trade link")
                }

                user.trade_url = tradeUrl
                await this.update(user)

                return true
            }

            throw new Error("Invalid trade link")
        }

        return false
    } catch (e) {
        throw new Error(`Error setTradeUrl ==> ${e}`)
    }
}
}
