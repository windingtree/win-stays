import { promises } from 'fs';
import { Web3Storage } from 'web3.storage';
import { File } from '@web-std/file';
const { readFile } = promises;

export default class IpfsApiService {
  private ipfsApi: Web3Storage;

  static async getMulterFile(file: Express.Multer.File): Promise<File> {
    const fileBuffer = await readFile(file.path);
    return new File([fileBuffer], file.originalname);
  }

  constructor(token: string) {
    this.ipfsApi = new Web3Storage({ token });
  }

  public async deployFilesToIpfs(files: Express.Multer.File[]): Promise<string[]> {
    return Promise.all(
      files.map(
        async multerFile => {
          const file = await IpfsApiService.getMulterFile(multerFile);
          return this.ipfsApi.put(
            [file],
            {
              wrapWithDirectory: false
            }
          )
        }
      )
    );
  }
}
