import { InputType } from '@nestjs/graphql';
import {
  SearchLiveDropInput as SearchLiveDropInputInterface,
  LiveDropType,
  LiveDropFilters,
} from 'typings/graphql';

@InputType()
export class SearchLiveDropInput implements SearchLiveDropInputInterface {
  userId?: string;
  caseId?: string;
  liveDropFilters?: LiveDropFilters;
}
