import type { ActionController } from '../types';
import type { ServiceProviderRegistry } from 'typechain/registries';
import { utils, Wallet } from 'ethers';
import ora from 'ora';
import { ServiceProviderRegistry__factory } from '../../typechain/factories/registries';
import { getWalletByAccountIndex } from './wallet';
import { green, yellow } from '../utils/print';
import { getAddresses, Role } from './addresses';
import { getConfig, removeConfig, requiredConfig, saveConfig } from './config';

export type SpinnerCallback = (text: string) => void;

export const getServiceProviderIdLocal = (salt: string, address: string): string => {
  const encoder = new utils.AbiCoder();
  return utils.solidityKeccak256(
    ['bytes'],
    [encoder.encode(
      [
        'bytes32',
        'address'
      ],
      [
        salt,
        address
      ]
    )]
  );
}

export const getServiceProviderId = (
  contract: ServiceProviderRegistry,
  salt: string,
  metadataUri: string,
): Promise<string> =>
  contract.callStatic.enroll(salt, metadataUri);

export const getRegistryContract = (wallet: Wallet): ServiceProviderRegistry => {
  requiredConfig(['registry']);
  return ServiceProviderRegistry__factory.connect(
    getConfig('registry') as string,
    wallet
  );
};

export const registerServiceProvider = async (
  contract: ServiceProviderRegistry,
  salt: string,
  metadataUri: string,
  spinnerCallback: SpinnerCallback
): Promise<string> => {
  const addresses = await getAddresses();
  const addressesMap = addresses.reduce(
    (a, v) => ({
      ...a,
      [Number(v.id)]: v.address
    }),
    {}
  );

  const serviceProviderId = await getServiceProviderId(
    contract,
    salt,
    metadataUri
  );

  spinnerCallback('Registering of the service provider');
  await contract.enroll(salt, metadataUri);

  spinnerCallback(`Granting ${addressesMap[Role.API]} the API role`);
  await contract.grantRole(
    utils.keccak256(
      utils.solidityPack(
        ['bytes32', 'uint256'],
        [serviceProviderId, Role.API]
      )
    ),
    addressesMap[Role.API]
  );

  spinnerCallback(`Granting ${addressesMap[Role.BIDDER]} the BIDDER role`);
  await contract.grantRole(
    utils.keccak256(
      utils.solidityPack(
        ['bytes32', 'uint256'],
        [serviceProviderId, Role.BIDDER]
      )
    ),
    addressesMap[Role.BIDDER]
  );

  spinnerCallback(`Granting ${addressesMap[Role.MANAGER]} the MANAGER role`);
  await contract.grantRole(
    utils.keccak256(
      utils.solidityPack(
        ['bytes32', 'uint256'],
        [serviceProviderId, Role.MANAGER]
      )
    ),
    addressesMap[Role.MANAGER]
  );

  spinnerCallback(`Granting ${addressesMap[Role.STAFF]} the STAFF role`);
  await contract.grantRole(
    utils.keccak256(
      utils.solidityPack(
        ['bytes32', 'uint256'],
        [serviceProviderId, Role.STAFF]
      )
    ),
    addressesMap[Role.STAFF]
  );

  // await contract.multicall([
  //   // enroll
  //   ServiceProviderRegistry__factory
  //     .createInterface()
  //     .encodeFunctionData('enroll', [salt, metadataUri]),
  //   // api-role
  //   ServiceProviderRegistry__factory
  //     .createInterface()
  //     .encodeFunctionData(
  //       'grantRole',
  //       [
  //         utils.keccak256(
  //           utils.solidityPack(
  //             ['bytes32', 'uint256'],
  //             [serviceProviderId, Role.API]
  //           )
  //         ),
  //         addressesMap[Role.API]
  //       ]
  //     ),
  //   // bidder-role
  //   ServiceProviderRegistry__factory
  //     .createInterface()
  //     .encodeFunctionData(
  //       'grantRole',
  //       [
  //         utils.keccak256(
  //           utils.solidityPack(
  //             ['bytes32', 'uint256'],
  //             [serviceProviderId, Role.BIDDER]
  //           )
  //         ),
  //         addressesMap[Role.BIDDER]
  //       ]
  //     ),
  //   // manager-role
  //   ServiceProviderRegistry__factory
  //     .createInterface()
  //     .encodeFunctionData(
  //       'grantRole',
  //       [
  //         utils.keccak256(
  //           utils.solidityPack(
  //             ['bytes32', 'uint256'],
  //             [serviceProviderId, Role.MANAGER]
  //           )
  //         ),
  //         addressesMap[Role.MANAGER]
  //       ]
  //     ),
  //   // staff-role
  //   ServiceProviderRegistry__factory
  //     .createInterface()
  //     .encodeFunctionData(
  //       'grantRole',
  //       [
  //         utils.keccak256(
  //           utils.solidityPack(
  //             ['bytes32', 'uint256'],
  //             [serviceProviderId, Role.STAFF]
  //           )
  //         ),
  //         addressesMap[Role.STAFF]
  //       ]
  //     )
  // ]);

  return serviceProviderId;
};

export const updateServiceProvider = async (
  contract: ServiceProviderRegistry,
  serviceProviderId: string,
  metadataUri: string,
  spinnerCallback: SpinnerCallback
): Promise<void> => {
  spinnerCallback('Updating the dataURI of the service provider...');
  await contract['file(bytes32,bytes32,string)'](
    serviceProviderId,
    utils.formatBytes32String('dataURI'),
    metadataUri
  );
};

export const serviceProviderController: ActionController = async (
  { salt, id, meta, register, update, reset },
  program
) => {
  const spinner = ora('Registering of the service provider...');

  try {
    if (reset) {
      removeConfig('serviceProviderId');
      removeConfig('salt');
      removeConfig('metadataUri');
      yellow('Information about the service provider is wiped out');
      return;
    }

    requiredConfig(['defaultAccountIndex']);

    const wallet = getWalletByAccountIndex(
      getConfig('defaultAccountIndex') as number
    );
    const owner = await wallet.getAddress();
    const contract = getRegistryContract(wallet);

    if (!salt) {
      requiredConfig(['salt']);
      salt = getConfig('salt') as string;
    }

    if (id) {
      const localId = getServiceProviderIdLocal(salt, owner);
      green(
        `Service provider Id: ${localId}`
      );
      return;
    }

    if (!meta) {
      requiredConfig(['metadataUri']);
      meta = getConfig('metadataUri') as string;
    }

    let serviceProviderId: string;

    if (register) {
      spinner.start();

      const serviceProviderId = await registerServiceProvider(
        contract,
        salt,
        meta,
        text => {
          spinner.text = text;
        }
      );

      saveConfig('salt', salt);
      saveConfig('metadataUri', meta);
      saveConfig('serviceProviderId', serviceProviderId);

      spinner.stop();

      green(
        `Service provider with Id: ${serviceProviderId} has been registered successfully`
      );
    } else if (update) {
      requiredConfig(['serviceProviderId']);

      spinner.start();

      serviceProviderId = getConfig('serviceProviderId') as string;
      await updateServiceProvider(
        contract,
        serviceProviderId,
        meta,
        text => {
          spinner.text = text;
        }
      );

      saveConfig('metadataUri', meta);

      spinner.stop();

      green(
        `Service provider with Id: ${serviceProviderId} has been updated successfully`
      );
      green(`The new "dataURI" is: ${meta}`);
    } else {
      requiredConfig(['serviceProviderId']);
      serviceProviderId = getConfig('serviceProviderId') as string;
      salt = getConfig('salt') as string;
      meta = await contract.datastores(serviceProviderId);

      spinner.stop();

      green(`Service provider Id: ${serviceProviderId}`);
      green(`Unique salt string: ${salt}`);
      green(`Metadata storage Id: ${meta}`);
      green(`Owner address: ${owner}`);
    }
  } catch (error) {
    spinner.stop();
    program.error(error, { exitCode: 1 });
  }
};
