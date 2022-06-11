import { TypedDataDomain } from "@ethersproject/abstract-signer";
import { VidereConfig } from "@windingtree/videre-sdk";
import { providers } from "ethers";
import { Settings } from "luxon";
import { LineRegistry__factory } from "./typechain-videre";

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
  'REACT_APP_NETWORK_NAME',
  'REACT_APP_BLOCK_EXPLORER',
  'REACT_APP_NETWORK_PROVIDER',
  'REACT_APP_VERIFYING_CONTRACT',
  'REACT_APP_WEB3STORAGE_KEY',
  'REACT_APP_LINE',
  'REACT_APP_VERSION'
]);

export const name = process.env.REACT_APP_NETWORK_NAME as string;
export const blockExplorer = process.env.REACT_APP_BLOCK_EXPLORER as string;
export const address = process.env.REACT_APP_VERIFYING_CONTRACT as string;
export const rpc = process.env.REACT_APP_NETWORK_PROVIDER as string;
export let chainId: number;
export let lineRegistryDataDomain: TypedDataDomain;
export let serviceProviderDataDomain: TypedDataDomain;


export const videreConfig: VidereConfig = {
  line: String(process.env.REACT_APP_LINE),
  version: Number(process.env.REACT_APP_VERSION)
}

export const wakuConfig = {
  maxPeers: 6,
  peers: [
    '/dns4/node-01.us-east-1.waku.windingtree.com/tcp/443/wss/p2p/16Uiu2HAmHXSN2XDZXdy8Dvyty5LtT7iSnWLGLMPoYbBnHaKeURxb',
    '/dns4/node-01.eu-central-1.waku.windingtree.com/tcp/443/wss/p2p/16Uiu2HAmV2PXCqrrjHbkceguC4Y2q7XgmzzYfjEgd69RvAU3wKvU',
    '/dns4/node-01.ap-southeast-2.waku.windingtree.com/tcp/443/wss/p2p/16Uiu2HAmGdTv8abaCW2BHYUhGeH97x7epzzbRY1CsgPbKhiJUB6C'
  ]
}

// TODO: Make the lineRegistryDomain and serviceProviderRegistry domain reactive as chainId changes with
//       different network selected

// configure from the RPC
;(async () => {
  const tempProvider = new providers.JsonRpcProvider(
    String(process.env.REACT_APP_NETWORK_PROVIDER)
  );
  chainId = (await tempProvider.getNetwork()).chainId;

  const lineRegistry = String(process.env.REACT_APP_VERIFYING_CONTRACT);
  const serviceProviderRegistry = await LineRegistry__factory.connect(
    lineRegistry,
    tempProvider
  ).serviceProviderRegistry();

  console.log(`Chain ID: ${chainId}`);
  console.log(`Line registry: ${lineRegistry}`);
  console.log(`Service Provider registry: ${serviceProviderRegistry}`);

  // line registry
  lineRegistryDataDomain = {
    name: videreConfig.line,
    version: String(videreConfig.version),
    verifyingContract: lineRegistry,
    chainId: Number(chainId)
  };

  // service provider registry
  serviceProviderDataDomain = {
    name: videreConfig.line,
    version: String(videreConfig.version),
    verifyingContract: serviceProviderRegistry,
    chainId: Number(chainId)
  };
})();
