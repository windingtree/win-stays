import { Facility, Item, Space } from '@windingtree/stays-models/src/proto/facility';
import { Level } from 'level';
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
  private db: Level<string, string | string[]>;
  private facilitiesDB;

  constructor() {
    this.dbService = DBService.getInstance();
    this.db = this.dbService.getDB();
    this.facilitiesDB = this.dbService.getFacilitiesDB();
  }

  public async getFacilitiesSublevels() {
    const idsDb: string[] = await this.facilitiesDB.values().all();
    const ids = new Set<string>(idsDb);
    return Array
      .from(ids)
      .reduce<Record<string, any>>(
        (a, id) => ({
          ...a,
          [id]: this.dbService.getFacilitySublevelDB(id)
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
    await this.dbService.getFacilitySublevelDB(id).put(
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

    const facilitySublevel = this.dbService.getFacilitySublevelDB(facilityId);
    let spaceIds;

    try {
      spaceIds = await facilitySublevel.get('spaces');
    } catch (e) {
      if (e.status !== 404) {
        throw e;
      }
      spaceIds = null;
    }

    if (Array.isArray(spaceIds)) {
      const spaceSet = new Set<string>(spaceIds);
      spaceSet.add(spaceId);
      await facilitySublevel.put(
        'spaces',
        Array.from(spaceSet)
      );
    } else {
      await facilitySublevel.put(
        'spaces',
        [spaceId]
      );
    }

    const spaceSublevel = this.dbService.getFacilitySpaceDB(facilityId, spaceId);

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
