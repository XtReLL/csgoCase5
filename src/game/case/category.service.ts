import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entity/category.entity';
import { CreateCategoryInput } from './dto/createCategory.input';

@Injectable()
export class СategoryService {
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
}
