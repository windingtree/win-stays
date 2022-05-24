import walletService from '../services/WalletService';
import { Request, Response } from 'express';

export class WalletController {
  public async getWallets(req: Request, res: Response): Promise<Response> {
    const accountsList = await walletService.getWalletAccounts();

    return res.json(accountsList);
  }
}

export default new WalletController();
