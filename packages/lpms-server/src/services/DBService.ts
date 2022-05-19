import { Level } from 'level';
import { dbDir } from 'src/config';
import { Token, User } from '../types';

export default class DBService {
  protected db: Level;
  protected userDB;
  protected loginDB;
  protected tokenDB;
  private static _instance: DBService = new DBService();

  constructor() {
    if (DBService._instance) {
      throw new Error("Error: Instantiation failed: Use DBService.getInstance() instead of new.");
    }
    DBService._instance = this;
    this.db = new Level<string, string>(dbDir, {
      valueEncoding: 'json',
      createIfMissing: true,
      errorIfExists: false
    });
    this.userDB = this.db.sublevel<string, User>('User', { valueEncoding: 'json' });
    this.loginDB = this.db.sublevel<string, string>('Login', { valueEncoding: 'json' });
    this.tokenDB = this.db.sublevel<string, Token>('Token', { valueEncoding: 'json' });
  }

  public static getInstance(): DBService {
    return DBService._instance;
  }

  public async open() {
    await this.db.open();
  }

  public async close() {
    await this.db.close();
  }

  public getUserDB() {
    return this.userDB;
  }

  public getLoginDB() {
    return this.loginDB;
  }

  public getTokenDB() {
    return this.tokenDB;
  }

  public getDB() {
    return this.db;
  }
}
