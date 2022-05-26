import type { Schema } from 'conf';
import type { ActionController, ConfigOptions, ConfigKeys } from '../types';
import Config from 'conf';
import { green } from '../utils/print';

const schema: Schema<ConfigOptions> = {
  apiUrl: {
    type: 'string'
  },
  providerUri: {
    type: 'string'
  },
  mnemonic: {
    type: 'string'
  },
  defaultAccountIndex: {
    type: 'number'
  },
  salt: {
    type: 'string'
  },
  metadataUri: {
    type: 'string'
  },
  registry: {
    type: 'string'
  },
  serviceProviderId: {
    type: 'string'
  },
  login: {
    type: 'object',
    properties: {
      accessToken: {
        type: 'string'
      },
      refreshToken: {
        type: 'string'
      }
    },
    required: [
      'accessToken',
      'refreshToken'
    ]
  }
};

const config = new Config({ schema });

export const getConfig = (path?: ConfigKeys): ConfigOptions[ConfigKeys] | ConfigOptions =>
  path
    ? config.get(path) as ConfigOptions[ConfigKeys]
    : config.store as ConfigOptions;

export const saveConfig = (path: string, value: ConfigOptions[ConfigKeys]): void =>
  config.set(path, value);

export const removeConfig = (path: ConfigKeys): void =>
  config.delete(path);

export const requiredConfig = (paths: ConfigKeys[]): void => {
  let ok = 0;
  for (const path of paths) {
    if (config.has(path)) {
      ok++;
    }
  }
  if (ok !== paths.length) {
    throw new Error(
      `Expected all of the following config properties to be set: ${paths.join(', ')}`
    );
  }
};

export const configController: ActionController = async ({ get, add, value, remove }, program) => {
  try {
    if (get) {
      green(`"${get}": ${getConfig(get)}`);
    } else if (add) {
      if (!value) {
        throw new Error('"--value" option must be provided');
      }
      saveConfig(add, value);
      green(`"${add}" with value "${value}" has been successfully added to config`);
    } else if (remove) {
      removeConfig(remove);
      green(`"${remove}" has been successfully removed from config`);
    } else {
      throw new Error('either "--get", "--add" or "--remove" option must be provided');
    }
  } catch (error) {
    program.error(error, { exitCode: 1 });
  }
}
