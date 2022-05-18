import type { ActionController } from '../types';
import axios from 'axios';
import { requiredConfig, getConfig, saveConfig } from './config';
import { green } from '../utils/print';

export const loginController: ActionController = async ({ login, password }, program) => {
  try {
    requiredConfig(['apiUrl']);

    const { data: { accessToken, refreshToken }} = await axios.post(
      `${getConfig('apiUrl')}/api/user/login`,
      {
        login,
        password
      }
    );

    saveConfig('login', { accessToken, refreshToken });
    green(`"${login}" user has been successfully logged in`);
  } catch (error) {
    program.error(error, { exitCode: 1 });
  }
}
