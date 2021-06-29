import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from 'user/entity/user.entity';


const config: TypeOrmModuleOptions = {
  type: 'mysql',
  host: 'db',
  port: 3306,
  username: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  acquireTimeout: 60000,
  connectTimeout: 60000,
  entities: [
    User
  ],
  synchronize: true,

  // migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
  // migrationsRun: true,
  cli: {
    migrationsDir: 'src/migrations',
  },
};

export default config;
