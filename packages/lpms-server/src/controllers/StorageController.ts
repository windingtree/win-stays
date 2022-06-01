import type { NextFunction, Request, Response } from 'express';
import type { SignedMessage } from '@windingtree/videre-sdk/dist/cjs/utils';
import type { Wallet } from 'ethers';
import { brotliCompressSync, brotliDecompressSync } from 'node:zlib';
import { promises } from 'fs';
import { utils } from 'ethers';
import { ServiceProviderData } from '@windingtree/stays-models/dist/cjs/proto/storage';
import { utils as vUtils, eip712 } from '@windingtree/videre-sdk';
import IpfsApiService from '../services/IpfsApiService';
import walletService from '../services/WalletService';
import { web3StorageKey, typedDataDomain } from '../config';
import { walletAccountsIndexes } from '../types';
import { Facility, Item, ItemType, Space } from '../proto/facility';
import facilitiesService from '../services/FacilitiesService';
import { FacilitySpaceLevelValues } from 'src/services/DBService';
const { readFile } = promises;

export class StorageController {
  signMetadata = async (
    data: ServiceProviderData & SignedMessage,
    signer: Wallet
  ): Promise<Uint8Array> => {
    const signedMessage = await vUtils.createSignedMessage(
      typedDataDomain,
      eip712.storage.ServiceProviderData,
      data,
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

      let fileBuffer = await readFile(multerFile.path);

      try {
        fileBuffer = brotliDecompressSync(fileBuffer);
      } catch(_) {
        // data is not compressed
      }

      const serviceProviderData = ServiceProviderData.fromBinary(fileBuffer);
      const serviceProviderId = utils.hexlify(serviceProviderData.serviceProvider);

      // Extract ans save/update facility from metadata
      await facilitiesService.setFacilityDbKeys(
        serviceProviderId,
        [
          [
            'metadata',
            Facility.fromBinary(serviceProviderData.payload) as Facility
          ]
        ]
      );

      // Extract spaces from metadata
      const spaces: Record<string, [string, FacilitySpaceLevelValues][]> = {};
      const otherItems: Record<string, [string, Item][]> = {};

      for (const item of serviceProviderData.items) {
        const itemId = utils.hexlify(item.item);
        const { type, payload, ...generic } = Item.fromBinary(item.payload);

        if (type === ItemType.SPACE) {
          spaces[itemId] = [
            [
              'metadata_generic',
              generic as Item
            ],
            [
              'metadata',
              (payload ? Space.fromBinary(payload) : {}) as Space
            ]
          ];
        } else {
          otherItems[itemId] = [
            [
              'metadata_generic',
              generic as Item
            ]
          ];
        }
      }

      // Add/update spaces to DB
      await Promise.all(
        Object
          .entries(spaces)
          .map(
            ([itemId, entries]) => facilitiesService.setItemDbKeys(
              serviceProviderId,
              'spaces',
              itemId,
              entries
            )
          )
      );

      // Add/update other items to DB
      await Promise.all(
        Object
          .entries(otherItems)
          .map(
            ([itemId, entries]) => facilitiesService.setItemDbKeys(
              serviceProviderId,
              'otherItems',
              itemId,
              entries
            )
          )
      );

      const signer = await walletService.getWalletByIndex(
        walletAccountsIndexes.API
      );

      const signedMetadata = await this.signMetadata(
        serviceProviderData as ServiceProviderData & SignedMessage,
        signer
      );

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
