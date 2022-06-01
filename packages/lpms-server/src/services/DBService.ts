import { AbstractSublevel } from 'abstract-level';
import { Level } from 'level';
import { Token, User } from '../types';
import { Facility, Item, Space } from '@windingtree/stays-models/src/proto/facility';
import {
  Availability,
  DayOfWeekLOSRule,
  DayOfWeekRateModifer,
  LOSRateModifier,
  NoticeRequiredRule,
  OccupancyRateModifier,
  Rates
} from '@windingtree/stays-models/src/proto/lpms';
import { Bytes } from 'ethers';
import { Person } from '@windingtree/stays-models/dist/cjs/proto/person';

type LevelDefaultTyping = string | Buffer | Uint8Array
type DBLevel = Level<string, string | string[]>
type StringAbstractDB = AbstractSublevel<DBLevel, LevelDefaultTyping, string, string>;

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
    return this.db.sublevel<string, Facility | string[]>(
      prefix + facilityId,
      { valueEncoding: 'json' }
    );
  }

  public getFacilityRulesDB(facilityId: string) {
    return this.getFacilitySublevelDB(facilityId).sublevel<string, NoticeRequiredRule | DayOfWeekLOSRule>(
      'rules',
      { valueEncoding: 'json' }
    );
  }

  public getFacilityModifiersDB(facilityId: string) {
    return this.getFacilitySublevelDB(facilityId).sublevel<string, DayOfWeekRateModifer | OccupancyRateModifier | LOSRateModifier>(
      'modifiers',
      { valueEncoding: 'json' }
    );
  }

  public getFacilityStubsDB(facilityId: string) {
    return this.getFacilitySublevelDB(facilityId).sublevel<string, string[] | Bytes>( // todo get from protobuf when mfw will describe
      'stubs',
      { valueEncoding: 'json' }
    );
  }

  public getFacilityPiiDB(facilityId: string) {
    return this.getFacilitySublevelDB(facilityId).sublevel<string, Person>(
      'pii',
      { valueEncoding: 'json' }
    );
  }

  public getFacilityOtherItemsDB(facilityId: string) {
    return this.getFacilitySublevelDB(facilityId).sublevel<string, Item>(
      'otherItems',
      { valueEncoding: 'json' }
    );
  }

  public getFacilitySpaceDB(facilityId: string, spaceId: string) {
    const prefix = 's_';
    return this.getFacilitySublevelDB(facilityId).sublevel<string, Item | Space>(
      prefix + spaceId,
      { valueEncoding: 'json' }
    );
  }

  public getSpaceRatesDB(facilityId: string, spaceId: string) {
    return this.getFacilitySpaceDB(facilityId, spaceId).sublevel<string, Rates>(
      'rates',
      { valueEncoding: 'json' }
    );
  }

  public getSpaceAvailabilityDB(facilityId: string, spaceId: string) {
    return this.getFacilitySpaceDB(facilityId, spaceId).sublevel<string, Availability>(
      'availability',
      { valueEncoding: 'json' }
    );
  }

  public getSpaceRulesDB(facilityId: string, spaceId: string) {
    return this.getFacilitySpaceDB(facilityId, spaceId).sublevel<string, NoticeRequiredRule | DayOfWeekLOSRule>(
      'rules',
      { valueEncoding: 'json' }
    );
  }

  public getSpaceModifiersDB(facilityId: string, spaceId: string) {
    return this.getFacilitySpaceDB(facilityId, spaceId)
      .sublevel<string, DayOfWeekRateModifer | OccupancyRateModifier | LOSRateModifier>(
        'modifiers',
        { valueEncoding: 'json' }
      );
  }

  public getSpaceStubsDB(facilityId: string, spaceId: string) {
    return this.getFacilitySpaceDB(facilityId, spaceId).sublevel<string, string[] | number>(
      'stubs',
      { valueEncoding: 'json' }
    );
  }
}
