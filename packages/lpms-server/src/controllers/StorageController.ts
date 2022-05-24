import type { NextFunction, Request, Response } from 'express';
import type { SignedMessage } from '@windingtree/videre-sdk/dist/cjs/utils';
import type { Wallet } from 'ethers';
import { brotliCompressSync, brotliDecompressSync } from 'node:zlib';
import { promises } from 'fs';
import { ServiceProviderData } from '@windingtree/stays-models/dist/cjs/proto/storage';
import { utils as vUtils, eip712 } from '@windingtree/videre-sdk';
import IpfsApiService from '../services/IpfsApiService';
import walletService from '../services/WalletService';
import { web3StorageKey, typedDataDomain } from '../config';
const { readFile } = promises;

export class StorageController {
  signMetadata = async (file: Express.Multer.File, signer: Wallet): Promise<Uint8Array> => {
    let fileBuffer = await readFile(file.path);

    try {
      fileBuffer = brotliDecompressSync(fileBuffer);
    } catch(_) {
      // data is not compressed
    }

    const serviceProviderData = ServiceProviderData.fromBinary(fileBuffer);

    const signedMessage = await vUtils.createSignedMessage(
      typedDataDomain,
      eip712.storage.ServiceProviderData,
      serviceProviderData as ServiceProviderData & SignedMessage,
      signer
    );

    return brotliCompressSync(
      ServiceProviderData.toBinary(signedMessage)
    );
  }

  uploadFile = async (req: Request, res: Response, next: NextFunction) => {
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

  uploadMetadata = async (req: Request, res: Response, next: NextFunction) => {
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
