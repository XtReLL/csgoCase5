import { Promocode } from 'promocode/entity/promocode.entity';
import { Factory } from 'typeorm-factory';


export const PromocodeFactory = () =>
  new Factory(Promocode)
    .attr('name', 'testPromocode')
