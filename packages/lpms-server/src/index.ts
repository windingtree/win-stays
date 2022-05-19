import ServerService from './services/ServerService';
import { port } from './config';
import BootstrapService from './services/BootstrapService';
import DBService from './services/DBService';

process.on('unhandledRejection', async error => {
  console.log(error);
  await DBService.getInstance().close();
  process.exit(1);
});

const main = async (): Promise<ServerService> => {
  const server = new ServerService(port);

  const bootstrapService = new BootstrapService();
  await bootstrapService.bootstrap();

  return server.start();
};

export default main()
  .catch(async error => {
    console.log(error);
    await DBService.getInstance().close();
    process.exit(1);
  });
