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

  constructor() {
    this.dbService = DBService.getInstance();
    this.db = this.dbService.getDB();
  }

  public async getFacilitiesSublevels() {
    let ids;

    try {
      ids = await this.db.get('facilities');
    } catch (e) {
      if (e.status !== 404) {
        throw e;
      }
    }
    // I don't understand what it is for
    if (Array.isArray(ids)) {
      const idsSet = new Set<string>(ids);
      return Array
        .from(idsSet)
        .reduce<Record<string, any>>(
          (a, id) => ({
            ...a,
            [id]: this.dbService.getFacilitySublevelDB(id)
          }),
          {}
        );
    }
    return [];
  }

  public async getFacility(sublevels: Record<string, any>, id: string) {

    //If I understood everything correctly, you can change to this
    // try {
    //   await this.dbService.getFacilitySublevelDB(id).values().all()
    //     } catch (e) {
    //   if (e.status === 404) {
    //     throw new Error(`Unknown facility: ${id} `);
    //   }
    //   throw e;
    // }

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
    let ids;

    try {
      ids = await this.db.get('facilities');
    } catch (e) {
      if (e.status !== 404) {
        throw e;
      }
    }

    if (Array.isArray(ids)) {
      const idsSet = new Set<string>(ids);
      idsSet.add(id);
      await this.db.put('facilities', Array.from(idsSet));
    } else {
      await this.db.put('facilities', [id]);
    }

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
