import { Level } from 'level';
import DBService from './DBService';
import userService from './UserService';
import { AppRole } from '../types';
import walletService from './WalletService';
import { defaultManagerLogin, defaultManagerPassword } from '../config';

export class BootstrapService {
  protected db: Level<string, string | string[]>;

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

    await userService.createUser(
      defaultManagerLogin,
      defaultManagerPassword,
      [AppRole.MANAGER]
    );

    await walletService.createNewWallet();

    await this.db.put('isConfigured', 'true');
  }
}

export default new BootstrapService();
