import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthorizedModel } from 'auth/model/authorized.model';
import { Repository } from 'typeorm';
import { User } from 'user/user/entity/user.entity';
import { ReferallCode } from './entity/referallCode.entity';
import { ReferallUser } from './entity/referallUser.entity';

@Injectable()
export class ReferallService {
  constructor(
    @InjectRepository(ReferallCode)
    private readonly referallCodeRepository: Repository<ReferallCode>,
    @InjectRepository(ReferallUser)
    private readonly referallUserRepository: Repository<ReferallUser>,
  ) {}

  findOne(code: string): Promise<ReferallCode> {
    return this.referallCodeRepository.findOneOrFail({ where: { code } });
  }
  findByUser(userId: number): Promise<ReferallCode> {
    return this.referallCodeRepository.findOneOrFail({ where: { userId } });
  }

  async createReferallCode(user: User): Promise<ReferallCode> {
    return await this.referallCodeRepository.save(
      this.referallCodeRepository.create({
        code: await this.generateRandomCode(),
        userId: user.id,
      }),
    );
  }

  async setReferallCode(user: User, code: string): Promise<ReferallCode> {
    const referallCode = await this.findOne(code);
    return this.referallCodeRepository.merge(referallCode, {
      code: code,
    });
  }

  async addReferall(user: User, auth: AuthorizedModel): Promise<ReferallUser> {
    return await this.referallUserRepository.save(
      this.referallUserRepository.create({
        codeId: (await auth.model.referallCode).id,
        referallId: user.id,
      }),
    );
  }

  generateRandomCode(): string {
    let result: string = '';
    const characters: string =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength: number = characters.length;

    for (let i = 0; i < Math.random() * charactersLength; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
  }
}
