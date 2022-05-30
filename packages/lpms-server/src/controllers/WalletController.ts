import walletService from '../services/WalletService';
import { NextFunction, Request, Response } from 'express';

export class WalletController {
  public async getWallets(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const accountsList = await walletService.getWalletAccounts();

      return res.json(accountsList);
    } catch (e) {
      next(e);
    }
  }
}

export default new WalletController();
