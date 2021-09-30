import { InputType } from '@nestjs/graphql';
import { CreateTagInput as CreateTagInputInterface } from 'typings/graphql';

@InputType()
export class CreateTagInput implements CreateTagInputInterface {
  name!: string;
}
