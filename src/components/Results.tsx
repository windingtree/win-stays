import type { LatLngTuple } from "leaflet";
import { useAppDispatch, useAppState } from '../store';
import { WakuMessage } from "js-waku";
import { useWakuObserver } from "../hooks/useWakuObserver";
import { processMessage } from "../utils/waku";
import { geoToH3, kRing } from 'h3-js';
import { Bids } from "../proto/bidask";
import { Pong } from "../proto/pingpong";
import { videreConfig } from "../config";
import Logger from "../utils/logger";
import { utils as vUtils, eip712 } from "@windingtree/videre-sdk"
import { ServiceProviderRegistry, ServiceProviderRegistry__factory } from '../typechain-videre';
import { utils } from "ethers";
import { Facility as FacilityMetadata, Item, ItemType, Space } from "../proto/facility";
import decompress from "brotli/decompress"
import axios from "axios";
import { ServiceProviderData } from "../proto/storage";
import { SignedMessage } from "@windingtree/videre-sdk/dist/cjs/utils";
import { Button, Box, Card, CardHeader, CardBody, CardFooter } from "grommet";
import { useNavigate } from "react-router-dom";

const logger = Logger('Results');

export const Results: React.FC<{
  center: LatLngTuple
}> = ({ center }) => {
  const { waku, provider, serviceProviderDataDomain, facilities } = useAppState();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const bidMessageHandler = (incomingMessage: WakuMessage): void => {
    try {
      const decodedMessage = processMessage<Bids>(
        Bids,
        incomingMessage
      );
      logger.info('Bid message arrived', decodedMessage)
    } catch (error) {
      console.error(error);
    }
  };

  const pongMessageHandler = async (incomingMessage: WakuMessage): Promise<void> => {
    try {
      const decodedMessage = processMessage<Pong>(
        Pong,
        incomingMessage
      );
      logger.info('Pong message arrived', decodedMessage)

      if (!decodedMessage) {
        throw new Error('decodedMessage if undefined');
      }

      if (!videreConfig.line || !serviceProviderDataDomain || !provider || !serviceProviderDataDomain.verifyingContract) {
        throw new Error('not ready to handle Pong');
      }

      const registry: ServiceProviderRegistry = ServiceProviderRegistry__factory.connect(serviceProviderDataDomain.verifyingContract, provider)
      const res = await vUtils.verifyMessage(
        decodedMessage.serviceProvider,
        {
          name: 'stays',
          version: '1',
          verifyingContract: '0xE7de8c7F3F9B24F9b8b519035eC53887BE3f5443',
          chainId: 77
        },
        eip712.pingpong.Pong,
        decodedMessage,
        async (which: Uint8Array, who: string) => {
          return vUtils.auth.isBidder(registry, utils.hexlify(which), who)
        }
      )
      logger.info('signature verification', res)
      if (!!res) {
        try {
          const contract = ServiceProviderRegistry__factory.connect(
            '0xC1A95DD6184C6A37A9Dd7b4b5E7DfBd5065C8Dd5',
            provider
          )
          const dataUri = await contract.datastores(decodedMessage.serviceProvider)
          logger.info('dataUri', dataUri)

          axios.get(`https://dweb.link/ipfs/${dataUri}`,
            {
              responseType: 'arraybuffer',
              headers: {
                'Content-Type': 'application/octet-stream',
                'Accept': 'application/octet-stream'
              }
            })
            .then(async (response) => {
              const blob = new Blob([response.data])
              const decompressed = decompress(Buffer.from(await blob.arrayBuffer()))
              logger.info('decompressed', decompressed)

              const serviceProviderData = ServiceProviderData.fromBinary(decompressed)
              logger.info('service provider data', serviceProviderData)

              // verify that this is signed correctly
              const isValid = await vUtils.verifyMessage(
                serviceProviderData.serviceProvider,
                {
                  name: 'stays',
                  version: '1',
                  verifyingContract: '0xE7de8c7F3F9B24F9b8b519035eC53887BE3f5443',
                  chainId: 77
                },
                eip712.storage.ServiceProviderData,
                serviceProviderData as SignedMessage,
                async (which: Uint8Array, who: string) => {
                  return vUtils.auth.isApi(registry, utils.hexlify(which), who)
                }
              )

              if (isValid) {
                logger.info('Verified metadata');

                const facility = FacilityMetadata.fromBinary(serviceProviderData.payload);
                logger.info('facility', facility)

                let spaces: Space[] = []
                for (const item of serviceProviderData.items) {
                  const itemDecoded = Item.fromBinary(item.payload);
                  // output generic item info
                  logger.info('item', item.item, ':', itemDecoded)

                  if (itemDecoded.type === ItemType.SPACE && itemDecoded.payload) {
                    // process a space
                    const space = Space.fromBinary(itemDecoded.payload);
                    logger.info('spaceItem payload decoded', space);
                    spaces.push(space)
                  }
                }

                dispatch({
                  type: 'SET_RECORD',
                  payload: {
                    name: 'facilities',
                    record: {
                      id: utils.hexlify(decodedMessage.serviceProvider),
                      ...facility,
                      spaces: spaces
                    }
                  }
                })
              } else {
                logger.info('Failed to verify metadata');
              }
            })
            .catch((error) => console.log(error));
        } catch (error) {
          logger.error(error)
        }
      } else {
        logger.error('invalid signature')
      }
    } catch (error) {
      console.error(error);
    }
  };

  const h3 = geoToH3(center[0], center[1], vUtils.constants.DefaultH3Resolution);
  const h3Indexes = kRing(h3, vUtils.constants.DefaultRingSize)
  useWakuObserver(
    waku,
    bidMessageHandler,
    h3Indexes.map((h) => vUtils.generateTopic({ ...videreConfig, topic: 'bid' }, h))
  );
  useWakuObserver(
    waku,
    pongMessageHandler,
    h3Indexes.map((h) => vUtils.generateTopic({ ...videreConfig, topic: 'pong' }, h))
  );
  return <Box
    style={{
      position: 'absolute',
      zIndex: '1',
      background: 'white',
      width: '25rem',
      margin: '1.25rem',
      right: 0,
      backgroundColor: 'rgba(0, 0, 0, 0)'
    }}
  >
    {facilities.map((facility) => <Card key={facility.id} pad='small' background={'white'} margin='5px'>
      <CardHeader>
        {facility.name}
      </CardHeader>
      <CardBody pad={'small'}>
        {facility.description}
      </CardBody>
      <CardFooter justify="end">
        <Button label='book' onClick={() => navigate(`/facility/${facility.id}`)} />
      </CardFooter>
    </Card>
    )}
  </Box>;
};
