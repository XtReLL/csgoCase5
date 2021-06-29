import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RedisClientService } from 'redis-client/redis-client.service';
import { Repository } from 'typeorm';
import { FindOrCreateUserDto } from './dto/findOrCreateUser.dto';
import { User } from './entity/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly redisClientService: RedisClientService
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
}
