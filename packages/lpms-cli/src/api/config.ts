import type { Schema } from 'conf';
import type { ActionController, ConfigOptions, ConfigKeys } from '../types';
import Config from 'conf';
import { green } from '../utils/print';

const schema: Schema<ConfigOptions> = {
  apiUrl: {
    type: 'string'
  },
  mnemonic: {
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

export const getConfig = (path?: string) =>
  path
    ? config.get(path)
    : config.store;

export const saveConfig = (path: string, value: ConfigOptions[ConfigKeys]): void =>
  config.set(path, value);

export const removeConfig = (path: ConfigKeys): void =>
  config.delete(path);

export const requiredConfig = (paths: string[]): void => {
  let ok = 0;
  for (const path of paths) {
    if (config.has(path)) {
      ok++;
    }
  }
  if (ok !== paths.length) {
    throw new Error(
      `Expected to be enabled all of the following config properties: ${paths.join(',')}`
    );
  }
};

export const configController: ActionController = async ({ add, value, remove }, program) => {
  try {
    if (add) {
      if (!value) {
        throw new Error('"--value" option must be provided');
      }
      saveConfig(add, value);
      green(`"${add}" with value "${value}" has been successfully added to config`);
    } else if (remove) {
      removeConfig(remove);
      green(`"${remove}" has been successfully removed from config`);
    } else {
      throw new Error('either "--add" or "--remove" option must be provided');
    }
  } catch (error) {
    program.error(error, { exitCode: 1 });
  }
}
