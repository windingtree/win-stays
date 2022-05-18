import { AppRole } from '../src/types';
import ServerService from './services/ServerService';
import UserService from './services/UserService';
import { port } from './config';

process.on('unhandledRejection', error => {
  console.log(error);
  process.exit(1);
});

const main = async (): Promise<ServerService> => {
  const server = new ServerService(port);

  const userService = new UserService();
  const users = await userService.getAllUsers();

  if (users.length === 0) {
    await userService.createUser(
      'manager',
      'winwin',
      [AppRole.MANAGER]
    );
  }

  return server.start();
};

export default main()
  .catch(error => {
    console.log(error);
    process.exit(1);
  });
