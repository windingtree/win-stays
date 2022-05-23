import type { NextFunction, Request, Response } from 'express';
import { proto } from '@windingtree/videre-sdk';
import IpfsApiService from '../services/IpfsApiService';
import { web3StorageKey } from '../config';

export class StorageController {
  public async uploadFile(req: Request, res: Response, next: NextFunction) {
    try {
      const file = req.file as Express.Multer.File;
      if (!file) {
        return next(new Error('File not uploaded'));
      }
      const storage = new IpfsApiService(web3StorageKey);
      const result = await storage.deployFilesToIpfs([file]);
      return res.json(result);
    } catch (e) {
      next(e);
    }
  }

  public async uploadMetadata(req: Request, res: Response, next: NextFunction) {
    try {
      const file = req.file as Express.Multer.File;
      if (!file) {
        return next(new Error('File not uploaded'));
      }

      // Validation of incoming data

      // Creation of signed container

      const storage = new IpfsApiService(web3StorageKey);
      const result = await storage.deployFilesToIpfs([file]);
      return res.json(result);
    } catch (e) {
      next(e);
    }
  }
}

export default new StorageController();
