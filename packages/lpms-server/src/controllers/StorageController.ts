import type { NextFunction, Request, Response } from 'express';
import type { TypedDataDomain } from '@ethersproject/abstract-signer';
import type { Wallet } from 'ethers';
import { promises } from 'fs';
import { ServiceProviderData } from '@windingtree/stays-models/dist/cjs/src/proto/storage';
import { utils as vUtils, eip712 } from '@windingtree/videre-sdk';
import IpfsApiService from '../services/IpfsApiService';
import walletService from '../services/WalletService';
import { web3StorageKey } from '../config';
const { readFile } = promises;

export type ServiceProviderDataUnsigned = Omit<ServiceProviderData, 'signature'>;

export class StorageController {
  public async signMetadata(file: Express.Multer.File, signer: Wallet): Promise<Uint8Array> {
    const domain: TypedDataDomain = {
      name: "stays",
      version: "1",
      chainId: 100
    };

    const fileBuffer = await readFile(file.path);
    const serviceProviderData = ServiceProviderData.fromBinary(fileBuffer) as ServiceProviderData;

    const signedMessage = await vUtils.createSignedMessage(
      domain,
      eip712.storage.ServiceProviderData,
      serviceProviderData,
      signer
    );

    return ServiceProviderData.toBinary(signedMessage);
  }

  public async uploadFile(req: Request, res: Response, next: NextFunction) {
    try {
      const multerFile = req.file as Express.Multer.File;
      if (!multerFile) {
        return next(new Error('File not uploaded'));
      }
      const storage = new IpfsApiService(web3StorageKey);
      const file = await IpfsApiService.getFileFromMulter(multerFile);
      const result = await storage.deployFilesToIpfs([file]);
      return res.json(result);
    } catch (e) {
      next(e);
    }
  }

  public async uploadMetadata(req: Request, res: Response, next: NextFunction) {
    try {
      const multerFile = req.file as Express.Multer.File;
      if (!multerFile) {
        return next(new Error('File not uploaded'));
      }

      const signer = await walletService.getWalletByIndex(0); // 0 - API role
      const signedMetadata = await this.signMetadata(multerFile, signer);

      const storage = new IpfsApiService(web3StorageKey);
      const file = IpfsApiService.getFileFromBuffer(
        signedMetadata,
        multerFile.originalname
      );
      const result = await storage.deployFilesToIpfs([file]);

      return res.json(result);
    } catch (e) {
      next(e);
    }
  }
}

export default new StorageController();
