import { BootstrapConsole } from 'nestjs-console';
import { AppModule } from './app.module';

const bootstrap = new BootstrapConsole({
  module: AppModule,
  useDecorators: false,
});

bootstrap.init().then(async (app) => {
  try {
    // init your app
    await app.init();
    // boot the cli
    await bootstrap.boot();
    process.exit(0);
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
});
