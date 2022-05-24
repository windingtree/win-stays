import { promises } from 'fs';
import { Web3Storage } from 'web3.storage';
import { File } from '@web-std/file';
const { readFile } = promises;

export default class IpfsApiService {
  private ipfsApi: Web3Storage;

  static getFileFromBuffer(fileBuffer: Uint8Array, fileName: string): File {
    return new File([fileBuffer], fileName);
  }

  static async getFileFromMulter(file: Express.Multer.File): Promise<File> {
    const fileBuffer = await readFile(file.path);
    return IpfsApiService.getFileFromBuffer(fileBuffer, file.originalname);
  }

  constructor(token: string) {
    this.ipfsApi = new Web3Storage({ token });
  }

  public async deployFilesToIpfs(files: File[]): Promise<string[]> {
    return Promise.all(
      files.map(
        async file => {
          const cid = this.ipfsApi.put(
            [file],
            {
              wrapWithDirectory: false
            }
          );
          return cid;
        }
      )
    );
  }
}
