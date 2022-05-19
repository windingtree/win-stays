import { Level } from 'level';
import DBService from './DBService';
import UserService from './UserService';
import { AppRole } from '../types';
import WalletService from './WalletService';
import { defaultManagerLogin, defaultManagerPassword } from '../config';

export default class BootstrapService {
  protected db: Level;

  constructor() {
    this.db = DBService.getInstance().getDB();
  }

  public async bootstrap(): Promise<void> {
    const isConfigured = await this.checkIsConfigured();

    if (!isConfigured) {
      console.log('configuration...');
      await this.configure();
      console.log('configuration complete!');
    }
  }

  private async checkIsConfigured(): Promise<boolean> {
    try {
      const isConfigured = await this.db.get('isConfigured');
      return isConfigured === 'true';
    } catch (e) {
      if (e.status === 404) {
        return false;
      }
      throw e;
    }
  }

  private async configure(): Promise<void> {
    const userService = new UserService();

    const defaultUser = await userService.getUserByLogin(defaultManagerLogin);

    if (!defaultUser) {
      await userService.createUser(
        defaultManagerLogin,
        defaultManagerPassword,
        [AppRole.MANAGER]
      );
    }

    await new WalletService().createNewWallet();

    await this.db.put('isConfigured', 'true');
  }
}
