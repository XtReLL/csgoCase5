import { InputType } from '@nestjs/graphql';
import { CreateCaseCategoryInput as CreateCaseCategoryInputInterface } from 'typings/graphql';

@InputType()
export class CreateCaseCategoryInput
  implements CreateCaseCategoryInputInterface
{
  name!: string;
}
