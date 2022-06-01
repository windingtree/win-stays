import { Level } from 'level';
import { Item } from '../proto/facility';
import DBService, { FacilityItemType, FacilityLevelValues, FacilitySpaceLevelValues } from './DBService';

export class FacilitiesService {
  private dbService: DBService;
  private db: Level<string, string | string[]>;

  constructor() {
    this.dbService = DBService.getInstance();
    this.db = this.dbService.getDB();
  }

  public async getFacilityIds(): Promise<string[]> {
    try {
      return await this.db.get<string, string[]>(
        'facilities',
        { valueEncoding: 'json' }
      );
    } catch (e) {
      if (e.status !== 404) {
        throw e;
      }
    }
    return [];
  }

  public async getItemIds(
    facilityId: string,
    itemType: FacilityItemType
  ): Promise<string[]> {
    try {
      const facilitySublevel = this.dbService.getFacilitySublevelDB(facilityId);
      return await facilitySublevel.get<string, string[]>(
        itemType,
        { valueEncoding: 'json' }
      );
    } catch (e) {
      if (e.status !== 404) {
        throw e;
      }
    }
    return [];
  }

  public async getFacilityDbKey(
    facilityId: string,
    key: string
  ): Promise<FacilityLevelValues> {
    try {
      return await this.dbService
        .getFacilitySublevelDB(facilityId)
        .get(key);
    } catch (e) {
      if (e.status === 404) {
        throw new Error(`Unable to get "${key}" of facility "${facilityId}"`);
      }
      throw e;
    }
  }

  public async getSpaceDbKey(
    facilityId: string,
    spaceId: string,
    key: string
  ): Promise<FacilitySpaceLevelValues> {
    try {
      return await this.dbService
        .getFacilityItemDB(facilityId, 'spaces', spaceId)
        .get(key);
    } catch (e) {
      if (e.status === 404) {
        throw new Error(
          `Unable to get "${key}" of space "${spaceId}" of facility "${facilityId}"`
        );
      }
      throw e;
    }
  }

  public async setFacilityDbKeys(
    facilityId: string,
    entries: [string, FacilityLevelValues][]
  ): Promise<void> {
    const ids = await this.getFacilityIds();

    if (ids.length > 0) {
      const idsSet = new Set<string>(ids);
      idsSet.add(facilityId);
      await this.db.put('facilities', Array.from(idsSet));
    } else {
      await this.db.put('facilities', [facilityId]);
    }

    const facilitySublevel = this.dbService.getFacilitySublevelDB(facilityId);

    await Promise.all(
      entries.map(
        ([key, value]) => facilitySublevel.put(key, value)
      )
    );
  }

  public async setItemDbKeys(
    facilityId: string,
    itemType: FacilityItemType,
    itemId: string,
    entries: [string, Item | FacilitySpaceLevelValues][]
  ): Promise<void> {
    const itemIds = await this.getItemIds(facilityId, itemType);
    const facilitySublevel = this.dbService.getFacilitySublevelDB(facilityId);

    if (itemIds.length > 0) {
      const spaceSet = new Set<string>(itemIds);
      spaceSet.add(itemId);
      await facilitySublevel.put(
        itemType,
        Array.from(spaceSet)
      );
    } else {
      await facilitySublevel.put(
        itemType,
        [itemId]
      );
    }

    const sublevel = this.dbService.getFacilityItemDB(
      facilityId,
      itemType,
      itemId
    );

    await Promise.all(
      entries.map(
        ([key, value]) => sublevel.put(key, value)
      )
    );
  }
}

export default new FacilitiesService();
