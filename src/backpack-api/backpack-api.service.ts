import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class BackpackApiService {
  constructor() {}
  async getItems(): Promise<Record<string, any>> {
    return new Promise((res, rej) => {
      axios
        .get(`http://csgobackpack.net/api/GetItemsList/v2/`)
        .then((data) => {
          const result = data.data;

          if (result.success) {
            return res(result.items_list);
          }

          return rej("Could't get items");
        })
        .catch((e) => {
          return rej(e.message);
        });
    });
  }
}
