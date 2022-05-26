import type { ActionController } from '../types';
import axios from 'axios';
import ora from 'ora';
import { requiredConfig, getConfig } from './config';

export enum Role {
  API = 0,
  BIDDER = 1,
  MANAGER = 2,
  STAFF = 3
}

export interface RoleAddress {
  id: number;
  role: Role;
  address: string;
}

export const getAddresses = async (): Promise<RoleAddress[]> => {
  requiredConfig(['apiUrl']);

  const { data } = await axios.get(
    `${getConfig('apiUrl')}/api/addresses`
  );

  return data;
};

export const addressesController: ActionController = async (_, program) => {
  const spinner = ora('Loading addresses').start();

  try {
    const addresses = await getAddresses();

    spinner.stop();

    console.table(
      addresses.reduce((acc, { id, ...x }) => { acc[id] = x; return acc}, {})
    );
  } catch (error) {
    spinner.stop();
    program.error(error, { exitCode: 1 });
  }
}
