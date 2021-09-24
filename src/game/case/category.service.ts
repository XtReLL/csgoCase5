import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entity/category.entity';
import { CreateCategoryInput } from './dto/createCategory.input';
import { paramsToBuilder } from 'list/params';
import { defaultPagination, Pagination } from 'list/pagination.input';
import { AuthorizedModel } from 'auth/model/authorized.model';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async create(createCategoryInput: CreateCategoryInput): Promise<Category> {
    return await this.categoryRepository.save(
      this.categoryRepository.create({ ...createCategoryInput }),
    );
  }

  async updateCategory(data: any): Promise<any> {
    return await this.categoryRepository.update(data.id, data);
  }

  async remove(id: string): Promise<boolean> {
    await this.categoryRepository.softRemove(await this.findById(id));
    return true;
  }

  async getAllCategories(): Promise<Category[]> {
    return await this.categoryRepository.find();
  }

  async findById(id: string): Promise<Category> {
    return await this.categoryRepository.findOneOrFail(parseInt(id));
  }

  async list(
    pagination: Pagination = defaultPagination,
  ): Promise<[Category[], number]> {
    const query = await paramsToBuilder<Category>(
      this.categoryRepository.createQueryBuilder(),
      pagination,
    );

    const result = await query.getManyAndCount();

    return result;
  }
}
