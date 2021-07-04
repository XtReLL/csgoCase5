import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthorizedModel } from 'auth/model/authorized.model';
import { Repository } from 'typeorm';
import { UpdateConfigInput } from './dto/update-config.input';
import { Config } from './entity/config.entity';

@Injectable()
export class ConfigService {
  constructor(
    @InjectRepository(Config)
    private readonly configRepository: Repository<Config>,
  ) {
    
  }
  async updateConfig(
    input: UpdateConfigInput,
    author: AuthorizedModel,
  ): Promise<Config> {
    const id = parseInt(input.id, 10)
    const config = await this.configRepository.findOneOrFail(id)
    return await this.configRepository.save(
      this.configRepository.merge(config, {
        ...input,
        id
      }), 
    );
  }

}
