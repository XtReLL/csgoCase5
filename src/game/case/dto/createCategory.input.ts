import { InputType } from '@nestjs/graphql';
import { CreateCategoryInput as CreateCategoryInputInterface } from 'typings/graphql';

@InputType()
export class CreateCategoryInput implements CreateCategoryInputInterface {
  name!: string;
}
