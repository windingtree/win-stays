import { AbstractSublevel } from 'abstract-level';
import { Level } from 'level';
import { Token, User } from '../types';
import { Facility, Item, Space } from '../proto/facility';
import {
  Availability,
  DayOfWeekLOSRule,
  DayOfWeekRateModifer,
  LOSRateModifier,
  NoticeRequiredRule,
  OccupancyRateModifier,
  Rates
} from '../proto/lpms';
import { Bytes } from 'ethers';
import { Person } from '@windingtree/stays-models/dist/cjs/proto/person';

export type LevelDefaultTyping = string | Buffer | Uint8Array
export type DBLevel = Level<string, string | string[]>
export type StringAbstractDB = AbstractSublevel<DBLevel, LevelDefaultTyping, string, string>;
export type FacilityRules = NoticeRequiredRule | DayOfWeekLOSRule;
export type FacilityModifiers = DayOfWeekRateModifer | OccupancyRateModifier | LOSRateModifier;
export type FacilityLevelValues = Facility | string[];
export type FacilitySpaceLevelValues = Item | Space;
export type FacilityItemType = 'spaces' | 'otherItems';
export type FacilityItemValues = Item | FacilitySpaceLevelValues;

export default class DBService {
  protected db: DBLevel;
  protected userDB: AbstractSublevel<DBLevel, LevelDefaultTyping, string, User>;
  protected loginDB: StringAbstractDB;
  protected tokenDB: AbstractSublevel<DBLevel, LevelDefaultTyping, string, Token>;

  private static _instance: DBService = new DBService();

  constructor() {
    if (DBService._instance) {
      throw new Error("Error: Instantiation failed: Use DBService.getInstance() instead of new.");
    }
    DBService._instance = this;
    this.db = new Level<string, string>('./database', {
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

  public getFacilitySublevelDB(facilityId: string) {
    const prefix = 'f_';
    return this.db.sublevel<string, FacilityLevelValues>(
      prefix + facilityId,
      { valueEncoding: 'json' }
    );
  }

  public getFacilityItemDB(facilityId: string, itemType: FacilityItemType, itemId: string) {
    const key = `${itemType}_${itemId}`;
    return this.getFacilitySublevelDB(facilityId).sublevel<string, FacilityItemValues>(
      key,
      { valueEncoding: 'json' }
    );
  }
}
