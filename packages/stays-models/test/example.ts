import { utils, Wallet } from "ethers";
import { Exception, Facility, Item, ItemType, Space, SpaceTier } from "../src/proto/facility";
import { ServiceProviderData } from "../src/proto/storage";
import { brotliCompressSync } from "node:zlib"
import { TypedDataDomain } from "@ethersproject/abstract-signer";

import { utils as vUtils, eip712 } from "@windingtree/videre-sdk"
import { SignedMessage } from "@windingtree/videre-sdk/dist/cjs/utils";


async function main() {
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
        policies: {
          checkInTimeOneof: { oneofKind: "checkInTime", checkInTime: "1500" },
          checkOutTimeOneof: { oneofKind: "checkOutTime", checkOutTime: "1000" }
        },
        photos: [
          { uri: '/image1.jpg', description: 'Chic guesthouse' },
          { uri: '/image2.jpg', description: 'Winter Wonderland' }
        ],
        website: 'https://wonderland.somewhere/',
        connectivity: {
          wifiAvailableOneof: { oneofKind: "wifiAvailable", wifiAvailable: true },
          wifiForFreeOneof: { oneofKind: "wifiForFree", wifiForFree: true }
        }
      }
    ),
    items: [
      {
        item: utils.arrayify(utils.formatBytes32String('UNIQUE-CODE-FOR-SPACE')),
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
                website: 'https://wonderland.somewhere/fancy',
                maxNumberOfAdultOccupantsOneof: { oneofKind: "maxNumberOfAdultOccupants", maxNumberOfAdultOccupants: 2 },
                maxNumberOfChildOccupantsOneof: { oneofKind: "maxNumberOfChildOccupantsException", maxNumberOfChildOccupantsException: Exception.UNSPECIFIED_REASON },
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
                    queenBedsOneof: { oneofKind: "queenBedsException", queenBedsException: Exception.UNSPECIFIED_REASON },
                    doubleBedsOneof: { oneofKind: "doubleBedsException", doubleBedsException: Exception.UNSPECIFIED_REASON },
                    singleOrTwinBedsOneof: { oneofKind: "singleOrTwinBedsException", singleOrTwinBedsException: Exception.UNSPECIFIED_REASON},
                    bunkBedsOneof: { oneofKind: "bunkBedsException", bunkBedsException: Exception.UNSPECIFIED_REASON },
                    sofaBedsOneof: { oneofKind: "sofaBedsException", sofaBedsException: Exception.UNSPECIFIED_REASON },
                    otherBedsOneof: { oneofKind: "otherBeds", otherBeds: 0 },
                    cribsOneof: { oneofKind: "cribs", cribs: false },
                    cribsAvailableOneof: { oneofKind: "cribsAvailableException", cribsAvailableException: Exception.UNSPECIFIED_REASON },
                    cribCountOneof: { oneofKind: "cribCountException", cribCountException: Exception.UNSPECIFIED_REASON },
                    rollAwayBedsOneof: { oneofKind: "rollAwayBeds", rollAwayBeds: false },
                    rollAwayBedsAvailableOneof: { oneofKind: "rollAwayBedsAvailableException", rollAwayBedsAvailableException: Exception.UNSPECIFIED_REASON },
                    rollAwayBedCountOneof: { oneofKind: "rollAwayBedCountException", rollAwayBedCountException: Exception.UNSPECIFIED_REASON }
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
  }

  const domain: TypedDataDomain = {
    name: "stays",
    version: "1",
    chainId: 100
  }

  const messageToUpload = await vUtils.createSignedMessage(
    domain,
    eip712.storage.ServiceProviderData,
    serviceProviderData as ServiceProviderData & SignedMessage,
    new Wallet(utils.randomBytes(32))
  )

  // test compression

  console.log(messageToUpload)
  console.log(`Signature: ${utils.hexlify(messageToUpload.signature)}`)
  console.log(`Protobuf length: ${brotliCompressSync(ServiceProviderData.toBinary(messageToUpload)).length}`)
}

main()
