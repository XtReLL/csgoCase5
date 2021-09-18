import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Case } from 'game/case/entity/case.entity';
import { CaseItems } from 'game/case/entity/caseItems.entity';
import { Config } from 'config/entity/config.entity';
import { GameCase } from 'game/game/entity/game-case.entity';
import { Inventory } from 'inventory/entity/inventory.entity';
import { Item } from 'item/entity/item.entity';
import { PromocodeUse } from 'promocode/entity/promocode-use.entity';
import { Promocode } from 'promocode/entity/promocode.entity';
import { User } from 'user/user/entity/user.entity';
import { Giveaway } from 'giveaway/entity/giveaway.entity';
import { GiveawayBet } from 'giveaway/entity/giveaway-bet.entity';
import { Payment } from 'payment/entity/payment.entity';
import { WithdrawItem } from 'withdraw/entity/withdrawItem.entity';
import { LiveDrop } from 'live-drop/entity/live-drop.entity';
import { Category } from 'game/case/entity/category.entity';
import { CategoryCase } from 'game/case/entity/category_case.entity';
import { ReferallCode } from 'user/referall/entity/referallCode.entity';
import { ReferallUser } from 'user/referall/entity/referallUser.entity';
import { Role } from 'user/user/entity/role.entity';
import { UserRole } from 'user/user/entity/user-role.entity';

const config: TypeOrmModuleOptions = {
  type: 'mysql',
  host: 'db',
  port: 3306,
  username: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  // acquireTimeout: 60000,
  connectTimeout: 60000,
  entities: [
    User,
    Promocode,
    PromocodeUse,
    Config,
    Item,
    Inventory,
    Case,
    CaseItems,
    GameCase,
    Giveaway,
    GiveawayBet,
    Payment,
    WithdrawItem,
    LiveDrop,
    Category,
    CategoryCase,
    ReferallCode,
    ReferallUser,
    Role,
    UserRole,
  ],
  synchronize: true,

  // migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
  // migrationsRun: true,
  cli: {
    migrationsDir: 'src/migrations',
  },
};

export default config;
