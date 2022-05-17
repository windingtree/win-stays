import { Level } from 'level';

export default class DBService {
  protected db: Level;
  protected userDB: any;
  protected loginDB: any;
  protected tokenDB: any;
  private static _instance;

  constructor();

  static getInstance(): DBService;

  open(): Promise<void>;

  close(): Promise<void>;

  getUserDB(): any;

  getLoginDB(): any;

  getTokenDB(): any;

  getDB(): Level<string, string>;
}
