import type { ActionController } from '../types';
import axios from 'axios';
import { requiredConfig, getConfig } from './config';
import { green } from '../utils/print';

export interface RoleAddress {
  id: number;
  role: string;
  address: string;
}

export const addressesController: ActionController = async (_, program) => {
  try {
    requiredConfig(['apiUrl']);

    const { data } = await axios.get(
      `${getConfig('apiUrl')}/api/addresses`
    );

    console.table(
      (data as RoleAddress[])
        .reduce((acc, {id, ...x}) => { acc[id] = x; return acc}, {})
    );
  } catch (error) {
    program.error(error, { exitCode: 1 });
  }
}
