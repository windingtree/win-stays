import { utils } from 'ethers';
import { keccak256 } from 'ethers/lib/utils';
import { DateTime } from 'luxon';
import { Ask } from 'src/proto/ask';
import { Exception, Facility, Item, ItemType, Space, SpaceTier } from 'src/proto/facility';
import { ContactType } from 'src/proto/contact';
// TODO: move this to local proto once new `stays-models` is published
import { ServiceProviderData } from '@windingtree/stays-models/dist/cjs/proto/storage';

//for test ↓
//import findSpaceService from './services/ExampleFindSpaceService';
//findSpaceService.mockSearch();
export class ExampleFindSpaceService {
  public mockSearch() {
    return this.checker(this.getMockObject());
  }

  public getMockObject() {
    const ask: Ask = {
      checkIn: { year: 2022, month: 6, day: 1 },
      checkOut: { year: 2022, month: 6, day: 7 },
      numPaxAdult: 2,
      numPaxChild: 2,
      numSpacesReq: 1,
    };

    return ask;
  }

  public checker(ask: Ask) {

    const serviceProviderData: ServiceProviderData = {
      serviceProvider: utils.arrayify(utils.formatBytes32String('provider')),
      payload: Facility.toBinary(
        {
          name: 'Awesome ski chalet',
          description: 'Some chalet in the best place of all! 🏔️',
          location: {
            latitude: 43.0335,
            longitude: 42.6895
          },
          emails: [],
          phones: [],
          uris: [],
          policies: {
            currencyCode: "xDAI",
            checkInTimeOneof: { oneofKind: "checkInTime", checkInTime: "1500" },
            checkOutTimeOneof: { oneofKind: "checkOutTime", checkOutTime: "1000" }
          },
          photos: [
            { uri: '/image1.jpg', description: 'Chic guesthouse' },
            { uri: '/image2.jpg', description: 'Winter Wonderland' }
          ],
          connectivity: {
            wifiAvailableOneof: { oneofKind: "wifiAvailable", wifiAvailable: true },
            wifiForFreeOneof: { oneofKind: "wifiForFree", wifiForFree: true }
          }
        }
      ),
      items: [
        {
          item: utils.arrayify(utils.formatBytes32String('UNIQUE-CODE-FOR-SPACE-1')),
          payload: Item.toBinary(
            {
              name: 'Fancy suite',
              description: 'Now with an onsen!',
              photos: [
                { uri: '/fancy/image1.jpg', description: 'Queen size bed' },
                { uri: '/fancy/image2.jpg', description: 'Modern shower' }
              ],
              type: ItemType.SPACE,
              payload: Space.toBinary(
                {
                  uris: [
                    {
                      uri: 'https://someplace/space',
                      typeOneof: {
                        oneofKind: 'type',
                        type: ContactType.WORK
                      }
                    }
                  ],
                  maxNumberOfAdultOccupantsOneof: {
                    oneofKind: "maxNumberOfAdultOccupants",
                    maxNumberOfAdultOccupants: 2
                  },
                  maxNumberOfChildOccupantsOneof: {
                    oneofKind: "maxNumberOfChildOccupants",
                    maxNumberOfChildOccupants: 2
                  },
                  maxNumberOfOccupantsOneof: { oneofKind: "maxNumberOfOccupants", maxNumberOfOccupants: 2 },
                  privateHomeOneof: { oneofKind: "privateHome", privateHome: false },
                  suiteOneof: { oneofKind: "suite", suite: false },
                  tierOneof: { oneofKind: "tier", tier: SpaceTier.DEFAULT_STANDARD },
                  views: {
                    viewOfValleyOneof: { oneofKind: "viewOfValley", viewOfValley: true },
                    viewOfBeachOneof: { oneofKind: "viewOfBeach", viewOfBeach: false },
                    viewOfCityOneof: { oneofKind: "viewOfCity", viewOfCity: false },
                    viewOfGardenOneof: { oneofKind: "viewOfGarden", viewOfGarden: false },
                    viewOfLakeOneof: { oneofKind: "viewOfLake", viewOfLake: false },
                    viewOfLandmarkOneof: { oneofKind: "viewOfLandmark", viewOfLandmark: false },
                    viewOfOceanOneof: { oneofKind: "viewOfOcean", viewOfOcean: false },
                    viewOfPoolOneof: { oneofKind: "viewOfPool", viewOfPool: false }
                  },
                  totalLivingAreas: {
                    sleeping: {
                      numberOfBedsOneof: { oneofKind: "numberOfBeds", numberOfBeds: 1 },
                      kingBedsOneof: { oneofKind: "kingBeds", kingBeds: 1 },
                      queenBedsOneof: {
                        oneofKind: "queenBedsException",
                        queenBedsException: Exception.UNSPECIFIED_REASON
                      },
                      doubleBedsOneof: {
                        oneofKind: "doubleBedsException",
                        doubleBedsException: Exception.UNSPECIFIED_REASON
                      },
                      singleOrTwinBedsOneof: {
                        oneofKind: "singleOrTwinBedsException",
                        singleOrTwinBedsException: Exception.UNSPECIFIED_REASON
                      },
                      bunkBedsOneof: {
                        oneofKind: "bunkBedsException",
                        bunkBedsException: Exception.UNSPECIFIED_REASON
                      },
                      sofaBedsOneof: {
                        oneofKind: "sofaBedsException",
                        sofaBedsException: Exception.UNSPECIFIED_REASON
                      },
                      otherBedsOneof: { oneofKind: "otherBeds", otherBeds: 0 },
                      cribsOneof: { oneofKind: "cribs", cribs: false },
                      cribsAvailableOneof: {
                        oneofKind: "cribsAvailableException",
                        cribsAvailableException: Exception.UNSPECIFIED_REASON
                      },
                      cribCountOneof: {
                        oneofKind: "cribCountException",
                        cribCountException: Exception.UNSPECIFIED_REASON
                      },
                      rollAwayBedsOneof: { oneofKind: "rollAwayBeds", rollAwayBeds: false },
                      rollAwayBedsAvailableOneof: {
                        oneofKind: "rollAwayBedsAvailableException",
                        rollAwayBedsAvailableException: Exception.UNSPECIFIED_REASON
                      },
                      rollAwayBedCountOneof: {
                        oneofKind: "rollAwayBedCountException",
                        rollAwayBedCountException: Exception.UNSPECIFIED_REASON
                      }
                    },
                    features: {
                      inSpaceWifiAvailableOneof: { oneofKind: "inSpaceWifiAvailable", inSpaceWifiAvailable: true }
                    }
                  }
                }
              )
            }
          )
        },
        {
          item: utils.arrayify(utils.formatBytes32String('UNIQUE-CODE-FOR-SPACE-2')),
          payload: Item.toBinary(
            {
              name: 'Fancy suite',
              description: 'Now with an onsen!',
              photos: [
                { uri: '/fancy/image1.jpg', description: 'Queen size bed' },
                { uri: '/fancy/image2.jpg', description: 'Modern shower' }
              ],
              type: ItemType.SPACE,
              payload: Space.toBinary(
                {
                  uris: [
                    {
                      uri: 'https://someplace/space',
                      typeOneof: {
                        oneofKind: 'type',
                        type: ContactType.WORK
                      }
                    }
                  ],
                  maxNumberOfAdultOccupantsOneof: {
                    oneofKind: "maxNumberOfAdultOccupants",
                    maxNumberOfAdultOccupants: 2
                  },
                  maxNumberOfChildOccupantsOneof: {
                    oneofKind: "maxNumberOfChildOccupants",
                    maxNumberOfChildOccupants: 2
                  },
                  maxNumberOfOccupantsOneof: { oneofKind: "maxNumberOfOccupants", maxNumberOfOccupants: 2 },
                  privateHomeOneof: { oneofKind: "privateHome", privateHome: false },
                  suiteOneof: { oneofKind: "suite", suite: false },
                  tierOneof: { oneofKind: "tier", tier: SpaceTier.DEFAULT_STANDARD },
                  views: {
                    viewOfValleyOneof: { oneofKind: "viewOfValley", viewOfValley: true },
                    viewOfBeachOneof: { oneofKind: "viewOfBeach", viewOfBeach: false },
                    viewOfCityOneof: { oneofKind: "viewOfCity", viewOfCity: false },
                    viewOfGardenOneof: { oneofKind: "viewOfGarden", viewOfGarden: false },
                    viewOfLakeOneof: { oneofKind: "viewOfLake", viewOfLake: false },
                    viewOfLandmarkOneof: { oneofKind: "viewOfLandmark", viewOfLandmark: false },
                    viewOfOceanOneof: { oneofKind: "viewOfOcean", viewOfOcean: false },
                    viewOfPoolOneof: { oneofKind: "viewOfPool", viewOfPool: false }
                  },
                  totalLivingAreas: {
                    sleeping: {
                      numberOfBedsOneof: { oneofKind: "numberOfBeds", numberOfBeds: 1 },
                      kingBedsOneof: { oneofKind: "kingBeds", kingBeds: 1 },
                      queenBedsOneof: {
                        oneofKind: "queenBedsException",
                        queenBedsException: Exception.UNSPECIFIED_REASON
                      },
                      doubleBedsOneof: {
                        oneofKind: "doubleBedsException",
                        doubleBedsException: Exception.UNSPECIFIED_REASON
                      },
                      singleOrTwinBedsOneof: {
                        oneofKind: "singleOrTwinBedsException",
                        singleOrTwinBedsException: Exception.UNSPECIFIED_REASON
                      },
                      bunkBedsOneof: {
                        oneofKind: "bunkBedsException",
                        bunkBedsException: Exception.UNSPECIFIED_REASON
                      },
                      sofaBedsOneof: {
                        oneofKind: "sofaBedsException",
                        sofaBedsException: Exception.UNSPECIFIED_REASON
                      },
                      otherBedsOneof: { oneofKind: "otherBeds", otherBeds: 0 },
                      cribsOneof: { oneofKind: "cribs", cribs: false },
                      cribsAvailableOneof: {
                        oneofKind: "cribsAvailableException",
                        cribsAvailableException: Exception.UNSPECIFIED_REASON
                      },
                      cribCountOneof: {
                        oneofKind: "cribCountException",
                        cribCountException: Exception.UNSPECIFIED_REASON
                      },
                      rollAwayBedsOneof: { oneofKind: "rollAwayBeds", rollAwayBeds: false },
                      rollAwayBedsAvailableOneof: {
                        oneofKind: "rollAwayBedsAvailableException",
                        rollAwayBedsAvailableException: Exception.UNSPECIFIED_REASON
                      },
                      rollAwayBedCountOneof: {
                        oneofKind: "rollAwayBedCountException",
                        rollAwayBedCountException: Exception.UNSPECIFIED_REASON
                      }
                    },
                    features: {
                      inSpaceWifiAvailableOneof: { oneofKind: "inSpaceWifiAvailable", inSpaceWifiAvailable: true }
                    }
                  }
                }
              )
            }
          )
        },
        {
          item: utils.arrayify(utils.formatBytes32String('UNIQUE-CODE-FOR-BREAKFAST')),
          payload: Item.toBinary({
            name: 'Amazing breakfast',
            description: 'no paleo here!',
            photos: [],
            type: ItemType.OTHER
          })
        }
      ],
      terms: []
    };

    const set = new Set();

    //get data from binary
    serviceProviderData.items.forEach(i => {
      const item = Item.fromBinary(i.payload);

      if (item.type === ItemType.SPACE) {
        set.add({
          id: keccak256(i.item),
          space: item
        });
      }
    });
    return this.findSpaces(Array.from(set), ask);
  }

  findSpaces(spaces, ask) {
    const needed = new Set();

    spaces.forEach(i => {
      const space = Space.fromBinary(i.space.payload) as Space;
      const numOfAdults = space.maxNumberOfAdultOccupantsOneof.oneofKind === 'maxNumberOfAdultOccupants'
        ? space.maxNumberOfAdultOccupantsOneof.maxNumberOfAdultOccupants
        : 0;

      const numOfChildren = space.maxNumberOfChildOccupantsOneof.oneofKind === 'maxNumberOfChildOccupants'
        ? space.maxNumberOfChildOccupantsOneof.maxNumberOfChildOccupants
        : 0;

      //check capacity
      if (!ExampleFindSpaceService.checkSuitableQuantity(numOfAdults, numOfChildren, ask.numPaxAdult, ask.numPaxChild)) {
        return;
      }

      //check dates is available
      if (ExampleFindSpaceService.checkAvailableDates(i.id, ask.checkIn, ask.checkOut)) {
        needed.add(space);
      }
    });

    //check number of rooms
    if (ask.numSpacesReq <= needed.size) {
      return Array.from(needed);
    } else {
      return [];
    }
  }

  private static checkSuitableQuantity(spaceGuestsCount, spaceChildrenCount, guestCount, childrenCount) {
    const guestCheck = spaceGuestsCount - guestCount;

    if (guestCheck < 0) {
      return false;
    }
    //if there is a place left from an adult, we give it to a child
    const childrenCheck = (spaceChildrenCount + guestCheck) - childrenCount;

    if (childrenCheck < 0) {
      return false;
    }

    //its coefficient for the future so that we can offer multiple rooms for a large group (available for discussion)
    // const check2 = spaceGuestsCount - guestCount + childrenCount > 0
    //   ? (spaceGuestsCount + spaceChildrenCount) / (spaceGuestsCount - guestCount + childrenCount)
    //   : 0;

    return true;
  }

  private static checkAvailableDates(id, checkIn, checkOut) {
    //mock DB
    const bookings = {
      '0x5e7f1708f44dae4d236e0310e732646d809875248082fa81cf7e56fb68e01ea5': {
        '1.6.2022': {
          guests: 2,
          finalCost: 150,
        },
        '2.6.2022': {
          guests: 2,
          finalCost: 150,
        },
        '3.6.2022': {
          guests: 2,
          finalCost: 150,
        },
      },
      '0x1eb5418d72521b4c321496ee7ffc13a651aa47cf56b56eef84fb076913e0288b': {},
      'someId': {},
    };

    const spaceBookings = bookings[id] || {};

    //const from = new DateTime([checkIn.year, checkIn.month - 1, checkIn.day]);
    let from = DateTime.fromObject(checkIn);
    const to = DateTime.fromObject(checkOut);

    while (from <= to) {
      //if object exist room is occupied, the room is not suitable

      if (spaceBookings[from.toFormat('d.M.yyyy')]) {
        return false;
      }

      from = from.plus({ days: 1 });
    }

    return true;
  }
}

export default new ExampleFindSpaceService();
