import { Facility, Item, Space } from '@windingtree/stays-models/src/proto/facility';
import DBService from './DBService';

export interface FacilityStorage {
  metadata: Facility;
  spaces: string[];
  otherItems: string[];
}

export interface SpaceStorage {
  'metadata_generic': Item;
  'metadata': Space;
}

export class FacilitiesService {
  private dbService: DBService;
  private db;
  private facilitiesDB;

  constructor() {
    this.dbService = DBService.getInstance();
    this.db = this.dbService.getDB();
    this.facilitiesDB = this.dbService.getFacilitiesDB();
  }

  private _createFacilitySublevel(id: string) {
    return this.db.sublevel<string, FacilityStorage>(
      id,
      { valueEncoding: 'json' }
    );
  }

  public async getFacilitiesSublevels() {
    const idsDb: string[] = await this.facilitiesDB.values().all();
    const ids = new Set<string>(idsDb);
    return Array
      .from(ids)
      .reduce<Record<string, any>>(
        (a, id) => ({
          ...a,
          [id]: this._createFacilitySublevel(id)
        }),
        {}
      );
  }

  public async getFacility(sublevels: Record<string, any>, id: string) {
    if (!sublevels[id]) {
      throw new Error(`Unknown facility: ${id} `);
    }
    return sublevels[id].values().all();
  }

  public async setFacilityMetadata(
    sublevels: Record<string, any>,
    id: string,
    metadata: Facility
  ) {
    if (!sublevels[id]) {
      sublevels[id] = this._createFacilitySublevel(id);
    }
    await sublevels[id].put(
      'metadata',
      metadata
    );
    return sublevels;
  }

  public async setFacilitySpace(
    sublevels: Record<string, any>,
    facilityId: string,
    spaceId: string,
    item: Item,
    space: Space
  ) {
    if (!sublevels[facilityId]) {
      sublevels[facilityId] = this._createFacilitySublevel(facilityId);
    }
    const spaces = new Set<string>(
      await sublevels[facilityId].get('spaces')
    );
    await sublevels[facilityId].put(
      'spaces',
      Array.from(spaces)
    );
    const spaceSublevel = sublevels[facilityId].sublevel<string, SpaceStorage>(
      spaceId,
      { valueEncoding: 'json' }
    );
    await spaceSublevel.put(
      'metadata_generic',
      item
    );
    await spaceSublevel.put(
      'metadata',
      space
    );
    return sublevels;
  }
}

export default new FacilitiesService();
