import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entity/category.entity';
import { CreateCategoryInput } from './dto/createCategory.input';
import { paramsToBuilder } from 'list/params';
import { defaultPagination, Pagination } from 'list/pagination.input';
import { AuthorizedModel } from 'auth/model/authorized.model';
import { Tag } from './entity/tag.entity';
import { CreateTagInput } from './dto/createTag.input ';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tag)
    private tagRepository: Repository<Tag>,
  ) {}

  async create(createTagInput: CreateTagInput): Promise<Tag> {
    return await this.tagRepository.save(
      this.tagRepository.create({ ...createTagInput }),
    );
  }

  async updateCategory(data: any): Promise<any> {
    return await this.tagRepository.update(data.id, data);
  }

  async remove(id: string): Promise<boolean> {
    await this.tagRepository.softRemove(await this.findById(id));
    return true;
  }

  async getAllTags(): Promise<Tag[]> {
    return await this.tagRepository.find();
  }

  async findById(id: string): Promise<Tag> {
    return await this.tagRepository.findOneOrFail(parseInt(id));
  }

  async list(
    pagination: Pagination = defaultPagination,
  ): Promise<[Tag[], number]> {
    const query = await paramsToBuilder<Tag>(
      this.tagRepository.createQueryBuilder(),
      pagination,
    );

    const result = await query.getManyAndCount();

    return result;
  }
}
