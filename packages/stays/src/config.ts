import { VidereConfig } from "@windingtree/videre-sdk";
import { Settings } from "luxon";

// Configure the time zone
Settings.defaultZone = 'Etc/GMT0';

const checkEnvVariables = (vars: string[]): void =>
  vars.forEach(
    variable => {
      if (
        !process.env[variable] ||
        process.env[variable] === ''
      ) {
        throw new Error(`${variable} must be provided in the ENV`);
      }
    }
  );

checkEnvVariables([
  'REACT_APP_NETWORK_ID',
  'REACT_APP_NETWORK_NAME',
  'REACT_APP_BLOCK_EXPLORER',
  'REACT_APP_NETWORK_PROVIDER',
  // 'REACT_APP_CONTRACT_ADDRESS',
]);

export const chainId = Number(process.env.REACT_APP_NETWORK_ID);
export const name = process.env.REACT_APP_NETWORK_NAME as string;
export const blockExplorer = process.env.REACT_APP_BLOCK_EXPLORER as string;
export const address = process.env.REACT_APP_CONTRACT_ADDRESS as string;
export const rpc = process.env.REACT_APP_NETWORK_PROVIDER as string;

export const videreConfig:VidereConfig = {
  line: 'stays',
  version: 1
}

export const wakuConfig = {
  maxPeers: 6,
  peers: [
    '/dns4/node-01.us-east-1.waku.windingtree.com/tcp/443/wss/p2p/16Uiu2HAmHXSN2XDZXdy8Dvyty5LtT7iSnWLGLMPoYbBnHaKeURxb',
    '/dns4/node-01.eu-central-1.waku.windingtree.com/tcp/443/wss/p2p/16Uiu2HAmV2PXCqrrjHbkceguC4Y2q7XgmzzYfjEgd69RvAU3wKvU',
    '/dns4/node-01.ap-southeast-2.waku.windingtree.com/tcp/443/wss/p2p/16Uiu2HAmGdTv8abaCW2BHYUhGeH97x7epzzbRY1CsgPbKhiJUB6C'
  ]
}
