import type { ActionController } from '../types';
import axios from 'axios';
import ora from 'ora';
import { requiredConfig, getConfig } from './config';

export interface RoleAddress {
  id: number;
  role: string;
  address: string;
}

export const addressesController: ActionController = async (_, program) => {
  const spinner = ora('Loading addresses').start();

  try {
    requiredConfig(['apiUrl']);

    const { data } = await axios.get(
      `${getConfig('apiUrl')}/api/addresses`
    );

    spinner.stop();

    console.table(
      (data as RoleAddress[])
        .reduce((acc, {id, ...x}) => { acc[id] = x; return acc}, {})
    );
  } catch (error) {
    spinner.stop();
    program.error(error, { exitCode: 1 });
  }
}
