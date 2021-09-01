import { Factory } from 'typeorm-factory';
import { Category } from '../entity/category.entity';

export const CategoryFactory = () =>
  new Factory(Category).attr('name', 'TestCategory');
